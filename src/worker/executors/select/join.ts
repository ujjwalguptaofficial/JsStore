import { Select } from "./";
import { IJoinQuery, DATA_TYPE, ERROR_TYPE, ISelectQuery } from "@/common";
import { getDataType, LogHelper, removeSpace, promiseReject } from "@/worker/utils";


export const executeJoinQuery = function (this: Select) {
    return new Join(this).execute();
}

interface JoinQueryWithInfo extends IJoinQuery {
    joinTableInfo: JoinTableInfo
}

export class Join {

    private joinQueryStack_: JoinQueryWithInfo[] = [];
    private currentQueryStackIndex_ = 0;
    tablesFetched = [];
    results = [];

    select: Select;
    constructor(select: Select) {
        this.select = select;
    }

    get query() {
        return this.select.query;
    }

    getTable(name: string) {
        return this.select.table(name);
    }

    private executeSelect(query: ISelectQuery) {
        // this.select.util.emptyTx();
        return new Select(query, this.select.util).
            execute();
    }

    execute() {
        const query = this.query;
        this.joinQueryStack_ = getDataType(query.join) === DATA_TYPE.Object ?
            [query.join as JoinQueryWithInfo] : query.join as JoinQueryWithInfo[];
        // get the data for first table
        const tableName = query.from;
        const tablesToFetch = [tableName];
        for (let i = 0, length = this.joinQueryStack_.length; i < length; i++) {
            const item = this.joinQueryStack_[i];
            let jointblInfo = this.getJoinTableInfo_(item.on);
            // table 1 is fetched & table2 needs to be fetched for join
            if (item.with === jointblInfo.table1.table) {
                jointblInfo = {
                    table1: jointblInfo.table2,
                    table2: jointblInfo.table1
                };
            }

            const err = this.checkJoinQuery_(jointblInfo, item);
            if (err) {
                return promiseReject(err);
            }
            this.joinQueryStack_[i].joinTableInfo = jointblInfo;
            tablesToFetch.push(item.with)
        }

        if (!this.select.isTxQuery) {
            this.select.util.createTransaction(tablesToFetch);
        }

        return this.executeSelect({
            from: tableName,
            where: query.where,
            case: query.case,
            flatten: query.flatten
        }).then(results => {
            this.results = results.map((item) => {
                return {
                    [this.currentQueryStackIndex_]: item
                };
            });
            this.tablesFetched.push(tableName);
            return this.startExecutingJoinLogic_();
        });
    }

    private onJoinQueryFinished_() {
        // const query = this.query;
        if (this.results.length > 0) {

            try {
                let results = [];
                const tables = Object.keys(this.results[0]);
                const tablesLength = tables.length;
                const mapWithAlias = (query: IJoinQuery, value: object) => {
                    if (query.as != null) {
                        for (const key in query.as) {
                            if (value[(query.as as any)[key]] === undefined) {
                                value[(query.as as any)[key]] = value[key];
                                delete value[key];
                            }
                        }
                    }
                    return value;
                };
                this.results.forEach((result) => {
                    let data = result["0"]; // first table data
                    for (let i = 1; i < tablesLength; i++) {
                        const query = this.joinQueryStack_[i - 1];
                        data = { ...data, ...mapWithAlias(query, result[i]) };
                    }
                    results.push(data);
                });
                this.select['results'] = results;
                this.select.setLimitAndSkipEvaluationAtEnd_();
                this.select.query.flatten = null;
                if (process.env.NODE_ENV === 'dev') {
                    try {
                        this.select.processOrderBy();
                    }
                    catch (ex) {
                        return promiseReject(
                            new LogHelper(ERROR_TYPE.InvalidOrderQuery, ex.message)
                        );
                    }
                }
                else {
                    this.select.processOrderBy();
                }

                if (process.env.NODE_ENV === 'dev') {
                    try {
                        this.select.processGroupDistinctAggr();
                    }
                    catch (ex) {
                        return promiseReject(
                            new LogHelper(ERROR_TYPE.InvalidGroupQuery, ex.message)
                        );
                    }
                }
                else {
                    this.select.processGroupDistinctAggr();
                }
            }
            catch (ex) {
                return promiseReject(
                    new LogHelper(ERROR_TYPE.InvalidJoinQuery, ex.message)
                );
            }
        }
        return;
    }

    private startExecutingJoinLogic_() {
        const joinQuery = this.joinQueryStack_[this.currentQueryStackIndex_];
        if (joinQuery) {
            try {
                let jointblInfo = joinQuery.joinTableInfo;
                return this.executeSelect({
                    from: joinQuery.with,
                    where: joinQuery.where,
                    case: joinQuery.case,
                    flatten: joinQuery.flatten
                }).then(results => {
                    this.jointables(joinQuery.type, jointblInfo, results);
                    this.tablesFetched.push(jointblInfo.table2.table);
                    ++this.currentQueryStackIndex_;
                    return this.startExecutingJoinLogic_();
                });
            }
            catch (ex) {
                return promiseReject(
                    new LogHelper(ERROR_TYPE.InvalidJoinQuery, ex.message)
                );
            }
        }
        else {
            return this.onJoinQueryFinished_();
        }
    }

    private jointables(joinType: string, jointblInfo: JoinTableInfo, secondtableData: any[]) {

        const results = [];
        const column1 = jointblInfo.table1.column;
        const column2 = jointblInfo.table2.column;
        const table1Index = this.tablesFetched.indexOf(jointblInfo.table1.table);
        const table2Index = this.currentQueryStackIndex_ + 1;
        const performInnerJoin = () => {
            let index = 0;
            this.results.forEach(valueFromFirstTable => {
                secondtableData.forEach((valueFromSecondTable) => {
                    if (valueFromFirstTable[table1Index][column1] === valueFromSecondTable[column2]) {
                        results[index] = { ...valueFromFirstTable };
                        results[index++][table2Index] = valueFromSecondTable;
                    }
                });
            });
        };
        const performleftJoin = () => {
            let index = 0;
            let valueMatchedFromSecondTable: any[];
            let callBack;
            const columnDefaultValue = {};
            this.getTable(jointblInfo.table2.table).columns.forEach(col => {
                columnDefaultValue[col.name] = null;
            });
            this.results.forEach((valueFromFirstTable) => {
                valueMatchedFromSecondTable = [];
                if (table2Index === 1) {
                    callBack = function (valueFromSecondTable) {
                        if (valueFromFirstTable[table1Index][column1] === valueFromSecondTable[column2]) {
                            valueMatchedFromSecondTable.push(valueFromSecondTable);
                        }
                    };
                }
                else {
                    callBack = function (valueFromSecondTable) {
                        const value = valueFromFirstTable[table1Index];
                        if (value != null && value[column1] === valueFromSecondTable[column2]) {
                            valueMatchedFromSecondTable.push(valueFromSecondTable);
                        }
                    };
                }
                secondtableData.forEach(callBack);
                if (valueMatchedFromSecondTable.length === 0) {
                    valueMatchedFromSecondTable = [columnDefaultValue];
                }
                valueMatchedFromSecondTable.forEach(function (value) {
                    results[index] = { ...valueFromFirstTable };
                    results[index++][table2Index] = value;
                });
            });
        };
        switch (joinType) {
            case "left":
                performleftJoin(); break;
            default:
                performInnerJoin();
        }
        this.results = results;
    }

    private getJoinTableInfo_(joinOn: string) {
        joinOn = removeSpace(joinOn);
        const splittedjoinOn = joinOn.split("=");
        const splittedjoinOnbydotFirst = splittedjoinOn[0].split(".");
        const splittedjoinOnbydotSecond = splittedjoinOn[1].split(".");
        const info = {
            table1: {
                table: splittedjoinOnbydotFirst[0],
                column: splittedjoinOnbydotFirst[1]
            },
            table2: {
                table: splittedjoinOnbydotSecond[0],
                column: splittedjoinOnbydotSecond[1]
            }
        } as JoinTableInfo;
        return info;
    }

    private checkJoinQuery_(jointblInfo: JoinTableInfo, qry: IJoinQuery) {
        const table1 = jointblInfo.table1;
        const table2 = jointblInfo.table2;
        const tableSchemaOf1stTable = this.getTable(table1.table);
        const tableSchemaOf2ndTable = this.getTable(table2.table);
        let err: LogHelper;

        // check on info & with info 
        if (qry.with !== table2.table) {
            err = new LogHelper(ERROR_TYPE.InvalidJoinQuery,
                `on value should contains value of with`
            );
        }

        // check for column existance

        if (tableSchemaOf1stTable.columns.find(q => q.name === table1.column) == null) {
            err = new LogHelper(ERROR_TYPE.InvalidJoinQuery,
                `column ${table1.column} does not exist in table ${table1.table}`
            );
        }
        else if (tableSchemaOf2ndTable.columns.find(q => q.name === table2.column) == null) {
            err = new LogHelper(ERROR_TYPE.InvalidJoinQuery,
                `column ${table2.column} does not exist in table ${table2.table}`
            );
        }

        // check for column match in both table
        if (qry.as == null) {
            qry.as = {};
        }
        tableSchemaOf1stTable.columns.every(function (column) {
            const columnFound = tableSchemaOf2ndTable.columns.find(q => q.name === column.name && q.name !== table1.column);
            if (columnFound != null && qry.as[columnFound.name] == null) {
                err = new LogHelper(ERROR_TYPE.InvalidJoinQuery,
                    `column ${column.name} exist in both table ${table1.table} & ${table2.table}`
                );
                return false;
            }
            return true;
        });
        return err;
    }
}

type JoinTableInfo = {
    table1: { table: string, column: string }
    table2: { table: string, column: string }
};