import { BaseSelect } from "./base_select";
import { JoinQuery, SelectQuery } from "../../types";
import * as Select from './instance';
import { QUERY_OPTION, DATA_TYPE } from "../../enums";
import { IError } from "../../interfaces";

export class Join extends BaseSelect {
    query: SelectQuery;
    joinStack: JoinQuery[] = [];
    currentQueryStackIndex = 0;
    tablesFetched = [];

    constructor(query: SelectQuery, onSuccess: (results: any[]) => void, onError: (err: IError) => void) {
        super();
        this.onSuccess = onSuccess;
        this.onError = onError;
        this.query = query;
        if (this.getType(query.join) === DATA_TYPE.Object) {
            this.joinStack = [query.join as JoinQuery];
        }
        else {
            this.joinStack = query.join as JoinQuery[];
        }
    }

    execute() {
        // get the data for first table
        const tableName = this.query.from;
        new Select.Instance({
            from: tableName,
            where: this.query.where,
            order: this.query.order
        }, (results) => {
            results.forEach((item, index) => {
                this.results[index] = {
                    [tableName]: item
                };
            });
            this.tablesFetched.push(tableName);
            this.startExecutionJoinLogic_();
        }, this.onErrorOccured).execute();
    }

    private onTransactionCompleted_() {
        if (this.query[QUERY_OPTION.Count]) {
            this.onSuccess(this.results.length);
        }
        else {
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
    }

    private startExecutionJoinLogic_() {
        const query = this.joinStack.shift();
        if (query) {
            let jointblInfo = this.getJoinTableInfo_(query.on);
            // table 1 is fetched & table2 needs to be fetched for join
            if (this.tablesFetched.indexOf(jointblInfo.table1.table) < 0) {
                jointblInfo = {
                    table1: jointblInfo.table2,
                    table2: jointblInfo.table1
                };
            }
            new Select.Instance({
                from: jointblInfo.table2.table,
                where: query.where
            }, (results) => {
                this.jointables(query.type, jointblInfo, results);
                this.tablesFetched.push(jointblInfo.table2.table);
                this.startExecutionJoinLogic_();
            }, this.onErrorOccured).execute();
        }
        else {
            this.onTransactionCompleted_();
        }
    }

    private jointables(joinType: string, jointblInfo: JoinTableInfo, secondtableData: any[]) {

        const results = [];
        const table1 = jointblInfo.table1.table;
        const column1 = jointblInfo.table1.column;
        const table2 = jointblInfo.table2.table;
        const column2 = jointblInfo.table2.column;

        const performInnerJoin = () => {
            let index = 0;
            this.results.forEach(valueFromFirstTable => {
                secondtableData.every(function (valueFromSecondTable) {
                    if (valueFromFirstTable[table1][column1] === valueFromSecondTable[column2]) {
                        results[index++] = {
                            [table1]: valueFromFirstTable[table1],
                            [table2]: valueFromSecondTable,
                        };
                        return false;
                    }
                    return true;
                });
            });
        };
        const performleftOuterJoin = () => {
            this.results.forEach((valueFromFirstTable, index) => {
                results[index] = {
                    [table1]: valueFromFirstTable[table1],
                    [table2]: null
                };
                secondtableData.every(function (valueFromSecondTable) {
                    if (valueFromFirstTable[table1][column1] === valueFromSecondTable[column2]) {
                        results[index][table2] = valueFromSecondTable;
                        return false;
                    }
                    return true;
                });
            });
        };
        switch (joinType) {
            case "left":
                performleftOuterJoin(); break;
            default:
                performInnerJoin();
        }
        this.results = results;
    }

    private getJoinTableInfo_(joinOn: string) {
        joinOn = joinOn.replace(/\s/g, '');
        const splittedjoinOn = joinOn.split("=");
        let splittedjoinOnbydot = splittedjoinOn[0].split(".");
        const info = {
            table1: {
                table: splittedjoinOnbydot[0],
                column: splittedjoinOnbydot[1]
            }
        } as JoinTableInfo;
        splittedjoinOnbydot = splittedjoinOn[1].split(".");
        info.table2 = {
            table: splittedjoinOnbydot[0],
            column: splittedjoinOnbydot[1]
        };
        return info;
    }
}

type JoinTableInfo = {
    table1: { table: string, column: string }
    table2: { table: string, column: string }
};