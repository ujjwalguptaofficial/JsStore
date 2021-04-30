import { Select } from "./";
import { JoinQuery, DATA_TYPE, QUERY_OPTION, ERROR_TYPE, SelectQuery } from "@/common";
import { getDataType, getError, LogHelper, removeSpace, promiseReject } from "@/worker/utils";


export const executeJoinQuery = function (this: Select) {
    const p = new Join(this).execute();
    return p.then(results => {
        return;
        this.results = results;
    })
}

export class Join {

    private joinQueryStack_: JoinQuery[] = [];
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

    private executeSelect(query: SelectQuery) {
        return new Select(query, this.select.util).
            execute(this.select.db);
    }

    execute() {
        const query = this.select.query;
        if (getDataType(query.join) === DATA_TYPE.Object) {
            this.joinQueryStack_ = [query.join as JoinQuery];
        }
        else {
            this.joinQueryStack_ = query.join as JoinQuery[];
        }
        // get the data for first table
        const tableName = query.from;
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
        }).catch(this.onException.bind(this));
    }

    private onJoinQueryFinished_() {
        const query = this.query;
        if (this.results.length > 0) {

            try {
                let results = [];
                const tables = Object.keys(this.results[0]);
                const tablesLength = tables.length;
                const mapWithAlias = (query: JoinQuery, value: object) => {
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
                        return this.onException(ex, ERROR_TYPE.InvalidOrderQuery);
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
                        return this.onException(ex, ERROR_TYPE.InvalidGroupQuery);
                    }
                }
                else {
                    this.select.processGroupDistinctAggr();
                }
            }
            catch (ex) {
                return this.onException(ex);
            }

            // if (this.query.skip && this.query.limit) {
            //     this.results.splice(0, this.query.skip);
            //     this.results = this.results.slice(0, this.query.limit);
            // }
            // else if (this.query.limit) {
            //     this.results = this.results.slice(0, this.query.limit);
            // }
        }
        return;
    }

    private startExecutingJoinLogic_() {
        const query = this.joinQueryStack_[this.currentQueryStackIndex_];
        if (query) {
            try {
                let jointblInfo = this.getJoinTableInfo_(query.on);
                // table 1 is fetched & table2 needs to be fetched for join
                if (query.with === jointblInfo.table1.table) {
                    jointblInfo = {
                        table1: jointblInfo.table2,
                        table2: jointblInfo.table1
                    };
                }

                if (process.env.NODE_ENV === 'dev') {
                    const err = this.checkJoinQuery_(jointblInfo, query);
                    if (err) {
                        return promiseReject(err);
                    }
                    //return this.onJoinQueryFinished_();
                }

                return this.executeSelect({
                    from: query.with,
                    where: query.where,
                    case: query.case,
                    flatten: query.flatten
                }).then(results => {
                    this.jointables(query.type, jointblInfo, results);
                    this.tablesFetched.push(jointblInfo.table2.table);
                    ++this.currentQueryStackIndex_;
                    return this.startExecutingJoinLogic_();
                }).catch(this.onException.bind(this));
            }
            catch (ex) {
                return this.onException(ex);
            }
        }
        else {
            return this.onJoinQueryFinished_();
        }
    }

    onException(ex, type = ERROR_TYPE.InvalidJoinQuery) {
        return this.select.onException(ex, type);
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

    private checkJoinQuery_(jointblInfo: JoinTableInfo, qry: JoinQuery) {
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
        return err ? getError(err, true) : err;
    }
}

type JoinTableInfo = {
    table1: { table: string, column: string }
    table2: { table: string, column: string }
};