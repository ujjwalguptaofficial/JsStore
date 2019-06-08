import { JoinQuery } from "../../types";
import * as Select from './instance';
import { QUERY_OPTION, DATA_TYPE, ERROR_TYPE } from "../../enums";
import { Helper } from "./orderby_helper";
import { LogHelper } from "../../log_helper";

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
            this.startExecutionJoinLogic_();
        }, this.onErrorOccured).execute();
    }

    private onJoinQueryFinished_() {
        if (this.error == null) {
            const mapWithAlias = (query: JoinQuery, value: object) => {
                if (query.as && value) {
                    for (const key in query.as) {
                        value[(query.as as any)[key]] = value[key];
                        delete value[key];
                    }
                }
                return value;
            };
            const results = [];
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
            this.processOrderBy();
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

    private startExecutionJoinLogic_() {
        const query = this.joinQueryStack_[this.currentQueryStackIndex_];
        if (query) {
            let jointblInfo = this.getJoinTableInfo_(query.on);
            if (process.env.NODE_ENV === 'dev') {
                this.checkJoinTableShema(jointblInfo, query);
                if (this.error != null) {
                    this.onJoinQueryFinished_();
                    return;
                }
            }
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
                ++this.currentQueryStackIndex_;
                this.startExecutionJoinLogic_();
            }, this.onErrorOccured).execute();
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

    private checkJoinTableShema(jointblInfo: JoinTableInfo, qry: JoinQuery) {
        const tableSchemaOf1stTable = this.getTable(jointblInfo.table1.table);
        const tableSchemaOf2ndTable = this.getTable(jointblInfo.table2.table);
        let err: LogHelper;
        if (qry.as == null) {
            qry.as = {};
        }
        tableSchemaOf1stTable.columns.every(function (column) {
            const columnFound = tableSchemaOf2ndTable.columns.find(q => q.name === column.name && q.name !== jointblInfo.table1.column);
            if (columnFound != null && qry.as[columnFound.name] == null) {
                err = new LogHelper(ERROR_TYPE.InvalidJoinQuery, {
                    column: column.name, table1: jointblInfo.table1.table,
                    table2: jointblInfo.table2.table
                });
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