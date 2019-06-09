import { JoinQuery, SelectQuery } from "../../types";
import * as Select from './instance';
import { QUERY_OPTION, DATA_TYPE, ERROR_TYPE, API } from "../../enums";
import { Helper } from "./orderby_helper";
import { LogHelper } from "../../log_helper";
import { QueryHelper } from "../query_helper";

export class Join extends Helper {

    private joinQueryStack_: JoinQuery[] = [];
    private currentQueryStackIndex_ = 0;
    tablesFetched = [];

    executeJoinQuery() {
        const query = this.query;
        if (this.getType(query.join) === DATA_TYPE.Object) {
            this.joinQueryStack_ = [query.join as JoinQuery];
        }
        else {
            this.joinQueryStack_ = query.join as JoinQuery[];
        }
        // get the data for first table
        const tableName = query.from;
        new Select.Instance({
            from: tableName,
            where: query.where,
        }, (results) => {
            results.forEach((item, index) => {
                this.results[index] = {
                    [this.currentQueryStackIndex_]: item
                };
            });
            this.tablesFetched.push(tableName);
            this.startExecutingJoinLogic_();
        }, this.onError).execute();
    }

    private onJoinQueryFinished_() {
        if (this.error == null) {
            try {
                const mapWithAlias = (query: JoinQuery, value: object) => {
                    if (query.as && value) {
                        for (const key in query.as) {
                            value[(query.as as any)[key]] = value[key];
                            delete value[key];
                        }
                    }
                    return value;
                };
                let results = [];
                const tables = Object.keys(this.results[0]);
                const tablesLength = tables.length;
                this.results.forEach((result) => {
                    let data = result["0"]; // first table data
                    for (let i = 1; i < tablesLength; i++) {
                        const query = this.joinQueryStack_[i - 1];
                        data = { ...data, ...mapWithAlias(query, result[i]) };
                    }
                    results.push(data);
                });
                this.results = results;
                // free results memory
                results = null;
                if (process.env.NODE_ENV === 'dev') {
                    try {
                        this.processOrderBy();
                    }
                    catch (ex) {
                        this.onError({
                            message: ex.message,
                            type: ERROR_TYPE.InvalidOrderQuery
                        });
                        return;
                    }
                }
                else {
                    this.processOrderBy();
                }
            }
            catch (ex) {
                this.onError({
                    message: ex.message,
                    type: ERROR_TYPE.InvalidJoinQuery
                });
                return;
            }

            if (this.query[QUERY_OPTION.Skip] && this.query[QUERY_OPTION.Limit]) {
                this.results.splice(0, this.query[QUERY_OPTION.Skip]);
                this.results.splice(this.query[QUERY_OPTION.Limit] - 1, this.results.length);
            }
            else if (this.query[QUERY_OPTION.Skip]) {
                this.results.splice(0, this.query[QUERY_OPTION.Skip]);
            }
            else if (this.query[QUERY_OPTION.Limit]) {
                this.results.splice(this.query[QUERY_OPTION.Limit] - 1, this.results.length);
            }
            this.onSuccess(this.results);
        }
        else {
            this.onError(this.error);
        }
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
                    this.checkJoinQuery_(jointblInfo, query);
                    if (this.error != null) {
                        this.onJoinQueryFinished_();
                        return;
                    }
                }

                new Select.Instance({
                    from: query.with,
                    where: query.where
                }, (results) => {
                    this.jointables(query.type, jointblInfo, results);
                    this.tablesFetched.push(jointblInfo.table2.table);
                    ++this.currentQueryStackIndex_;
                    this.startExecutingJoinLogic_();
                }, this.onError).execute();
            }
            catch (ex) {
                this.onError({
                    message: ex.message,
                    type: 'invalid_query' as any
                });
            }
        }
        else {
            this.onJoinQueryFinished_();
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
                        results[index] = valueFromFirstTable;
                        results[index++][table2Index] = valueFromSecondTable;
                    }
                });
            });
        };
        const performleftJoin = () => {
            let index = 0;
            let valueMatchedFromSecondTable: any[];
            this.results.forEach((valueFromFirstTable) => {
                valueMatchedFromSecondTable = [];
                secondtableData.forEach(function (valueFromSecondTable) {
                    if (valueFromFirstTable[table1Index][column1] === valueFromSecondTable[column2]) {
                        valueMatchedFromSecondTable.push(valueFromSecondTable);
                    }
                });
                if (valueMatchedFromSecondTable.length === 0) {
                    valueMatchedFromSecondTable = [null];
                }
                valueMatchedFromSecondTable.forEach(function (value) {
                    results[index] = valueFromFirstTable;
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
        joinOn = this.removeSpace(joinOn);
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
        if (err != null) {
            this.onErrorOccured(err, true);
        }
    }
}

type JoinTableInfo = {
    table1: { table: string, column: string }
    table2: { table: string, column: string }
};