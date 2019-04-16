import { BaseSelect } from "./base_select";
import { SelectJoinQuery, TableJoinQuery, JoinQuery, SelectQuery } from "../../types";
import * as Select from './instance';
import { QUERY_OPTION } from "../../enums";
import { IError } from "../../interfaces";

export class Join extends BaseSelect {
    query: SelectJoinQuery;
    queryStack: TableJoinQuery[] = [];
    currentQueryStackIndex = 0;

    constructor(query: SelectJoinQuery, onSuccess: (results: any[]) => void, onError: (err: IError) => void) {
        super();
        this.onSuccess = onSuccess;
        this.onError = onError;
        this.query = query;
        const tableList = []; // used to open the multiple object store

        const convertQueryIntoStack = (qry: JoinQuery) => {
            if (qry.table1 !== undefined) {
                qry.table2['joinType'] = qry.join === undefined ? 'inner' : qry.join.toLowerCase();
                this.queryStack.push(qry.table2);
                if (this.queryStack.length % 2 === 0) {
                    this.queryStack[this.queryStack.length - 1].nextJoin = (qry as any).nextJoin;
                }
                tableList.push(qry.table2.table);
                return convertQueryIntoStack(qry.table1 as any);
            }
            else {
                this.queryStack.push(qry as any);
                tableList.push((qry as any).table);
                return;
            }
        };
        convertQueryIntoStack(query.from);
        this.queryStack.reverse();
        // get the data for first table
        if (!this.error) {
            const selectObject = new Select.Instance({
                from: this.queryStack[0].table,
                where: this.queryStack[0].where
            } as SelectQuery, (results) => {
                const tableName = this.queryStack[0].table;
                results.forEach((item, index) => {
                    this.results[index] = {};
                    this.results[index][tableName] = item;
                });
                this.startExecutionJoinLogic_();
            }, this.onErrorOccured);
            selectObject.execute();
        }
    }

    private onTransactionCompleted_(e) {
        if (this.onSuccess != null && (this.queryStack.length === this.currentQueryStackIndex + 1)) {
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
    }

    private executeWhereJoinLogic_(joinQuery: TableJoinQuery, query: TableJoinQuery) {
        const results = [],
            column = query.column,
            tmpresults = this.results,
            resultLength = tmpresults.length;
        let item, joinIndex = 0;

        // get the data from query table
        const selectObject = new Select.Instance({
            from: query.table,
            order: query.order,
            where: query.where
        } as SelectQuery, (selectResults) => {
            // perform join
            selectResults.forEach((value, index) => {
                // search item through each global result
                for (let i = 0; i < resultLength; i++) {
                    item = tmpresults[i][joinQuery.table][joinQuery.column];
                    doJoin(item, value, i);
                }
            });
            this.results = results;
            // check if further execution needed
            if (this.queryStack.length > this.currentQueryStackIndex + 1) {
                this.startExecutionJoinLogic_();
            }
            else {
                this.onTransactionCompleted_(null);
            }

        }, this.onErrorOccured);
        selectObject.execute();

        const doJoin = (value1, value2, itemIndex) => {
            results[joinIndex] = {};
            if (value1 === value2[query.column]) {
                results[joinIndex][query.table] = value2;
                // copy other relative data into current result
                for (let j = 0; j < this.currentQueryStackIndex; j++) {
                    results[joinIndex][this.queryStack[j].table] =
                        tmpresults[itemIndex][this.queryStack[j].table];
                }
                ++joinIndex;
            }
            else if (query.joinType === 'left') {
                // left join
                results[joinIndex] = {};
                results[joinIndex][query.table] = null;
                // copy other relative data into current result
                for (let j = 0; j < this.currentQueryStackIndex; j++) {
                    results[joinIndex][this.queryStack[j].table] =
                        tmpresults[itemIndex][this.queryStack[j].table];
                }
                ++joinIndex;
            }
        };
    }

    private executeRightJoin_(joinQuery: TableJoinQuery, query: TableJoinQuery) {
        const joinresults = [],
            joinIndex = 0,
            column = query.column,
            tmpresults = this.results,
            resultLength = tmpresults.length,
            where = {};

        let itemIndex = 0;

        const onExecutionFinished = () => {
            this.results = joinresults;
            // check if further execution needed
            if (this.queryStack.length > this.currentQueryStackIndex + 1) {
                this.startExecutionJoinLogic_();
            }
            else {
                this.onTransactionCompleted_(null);
            }
        };
        const doRightJoin = (results) => {
            let valueFound = false;
            results.forEach(function (item, index) {
                for (itemIndex = 0; itemIndex < resultLength; itemIndex++) {
                    if (item[query.column] ===
                        tmpresults[itemIndex][joinQuery.table][joinQuery.column]) {
                        valueFound = true;
                        break;
                    }
                }
                joinresults[index] = {};
                joinresults[index][query.table] = item;
                if (valueFound) {
                    valueFound = false;
                    for (let j = 0; j < this.currentQueryStackIndex; j++) {
                        joinresults[index][this.queryStack[j].table] =
                            tmpresults[itemIndex][this.queryStack[j].table];
                    }
                }
                else {
                    for (let j = 0; j < this.currentQueryStackIndex; j++) {
                        joinresults[index][this.queryStack[j].table] = null;
                    }
                }
            }, this);
        };
        const executeLogic = () => {
            const selectObject = new Select.Instance({
                from: query.table,
                order: query.order,
                where: query.where
            } as SelectQuery, (results) => {
                doRightJoin(results);
                onExecutionFinished();
            }, this.onErrorOccured);
            selectObject.execute();
        };
        executeLogic();
    }

    private executeWhereUndefinedLogicForJoin_(joinQuery: TableJoinQuery, query: TableJoinQuery) {
        const joinresults = [],
            column = query.column,
            tmpresults = this.results,
            where = {},
            // Item,
            resultLength = tmpresults.length;

        let joinIndex = 0,
            itemIndex = 0;
        const onExecutionFinished = () => {
            this.results = joinresults;
            // check if further execution needed
            if (this.queryStack.length > this.currentQueryStackIndex + 1) {
                this.startExecutionJoinLogic_();
            }
            else {
                this.onTransactionCompleted_(null);
            }
        };
        const doJoin = (results) => {
            if (results.length > 0) {
                results.forEach((value) => {
                    joinresults[joinIndex] = {};
                    joinresults[joinIndex][query.table] = value;
                    // copy other relative data into current result
                    for (let k = 0; k < this.currentQueryStackIndex; k++) {
                        joinresults[joinIndex][this.queryStack[k].table] =
                            tmpresults[itemIndex][this.queryStack[k].table];
                    }
                    ++joinIndex;
                });
            }
            else if (query.joinType === 'left') {
                // left join
                joinresults[joinIndex] = {};
                joinresults[joinIndex][query.table] = null;
                // copy other relative data into current result
                for (let j = 0; j < this.currentQueryStackIndex; j++) {
                    joinresults[joinIndex][this.queryStack[j].table] =
                        tmpresults[itemIndex][this.queryStack[j].table];
                }
                ++joinIndex;
            }
        };
        const executeLogic = () => {
            if (itemIndex < resultLength) {
                if (!this.error) {
                    where[query.column] = tmpresults[itemIndex][joinQuery.table][joinQuery.column];
                    const selectInstance = new Select.Instance({
                        from: query.table,
                        order: query.order,
                        where: where
                    } as SelectQuery, (results) => {
                        doJoin(results);
                        ++itemIndex;
                        executeLogic();
                    }, this.onErrorOccured.bind(this));
                    selectInstance.execute();
                }
            }
            else {
                onExecutionFinished();
            }
        };
        executeLogic();
    }

    private startExecutionJoinLogic_() {
        let joinQuery;
        if (this.currentQueryStackIndex >= 1 && this.currentQueryStackIndex % 2 === 1) {
            joinQuery = {
                column: this.queryStack[this.currentQueryStackIndex].nextJoin.column,
                table: this.queryStack[this.currentQueryStackIndex].nextJoin.table
            } as TableJoinQuery;
            this.currentQueryStackIndex++;
        }
        else {
            joinQuery = this.queryStack[this.currentQueryStackIndex++];
        }

        const query = this.queryStack[this.currentQueryStackIndex];
        if (query.joinType === 'right') {
            this.executeRightJoin_(joinQuery, query);
        }
        else if (query.where) {
            this.executeWhereJoinLogic_(joinQuery, query);
        }
        else {
            this.executeWhereUndefinedLogicForJoin_(joinQuery, query);
        }
    }
}