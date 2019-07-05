import { API, ERROR_TYPE, QUERY_OPTION, DATA_TYPE } from "../enums";
import { IdbHelper } from "./idb_helper";
import { InsertQuery } from "../types";
import { LogHelper } from "../log_helper";
import * as Update from "./update/index";
import * as Insert from "./insert/index";
import { Table } from "../model/index";
import { IError } from "../interfaces";
import { promise } from "../helpers/index";
import { getDataType } from "../utils/index";

export class QueryHelper {
    api: API;
    query;
    error: IError;
    isTransaction = false;
    static autoIncrementValues: { [table: string]: { [columnName: string]: number } } = {};

    constructor(api: API, query: any) {
        this.api = api;
        this.query = query;
    }
    checkAndModify() {
        return promise((resolve, reject) => {
            const resolveReject = () => {
                if (this.error == null) {
                    resolve();
                }
                else {
                    reject(this.error);
                }
            };
            switch (this.api) {
                case API.Select:
                case API.Remove:
                case API.Count:
                    this.checkFetchQuery_();
                    resolveReject();
                    break;
                case API.Insert:
                    this.checkInsertQuery_().then(resolveReject).
                        catch((err) => {
                            this.error = err;
                            resolveReject();
                        });
                    break;
                case API.Update:
                    this.checkUpdateQuery_();
                    resolveReject();
                    break;
                case API.BulkInsert:
                    this.checkBulkInsert_();
                    break;
            }
        });
    }

    private isInsertQryValid_(callBack: (tbl: Table) => void) {
        const table = this.getTable_((this.query as InsertQuery).into);
        let log: LogHelper;
        if (table) {
            switch (getDataType(this.query.values)) {
                case DATA_TYPE.Array:
                    break;
                case DATA_TYPE.Null:
                    log = new LogHelper(ERROR_TYPE.NoValueSupplied);
                    break;
                default:
                    log = new LogHelper(ERROR_TYPE.NotArray);
            }
        }
        else {
            log = new LogHelper(ERROR_TYPE.TableNotExist, { tableName: (this.query as InsertQuery).into });
        }
        callBack(table);
        return log == null ? null : log.get();
    }

    private checkBulkInsert_() {
        this.error = this.isInsertQryValid_(function () {

        });
    }

    private checkInsertQuery_() {
        return promise((resolve, reject) => {
            let table;
            const err = this.isInsertQryValid_((tbl) => {
                table = tbl;
            });
            if (err == null) {
                if (this.query.skipDataCheck === true) {
                    resolve();
                }
                else {
                    const valueCheckerInstance = new Insert.ValuesChecker(table, this.query.values);
                    valueCheckerInstance.checkAndModifyValues().then(() => {
                        (this.query as InsertQuery).values = valueCheckerInstance.values;
                        resolve();
                    }).catch(reject);
                }
            }
            else {
                reject(err);
            }
        });
    }

    private checkUpdateQuery_() {
        this.error = new Update.SchemaChecker(this.getTable_(this.query.in)).
            check(this.query.set, this.query.in);
        if (this.error == null) {
            if (this.query.where != null) {
                this.checkForNullInWhere_();
                if (this.error == null) {
                    this.addGreatAndLessToNotOp_();
                }
            }
        }
    }

    private checkForNullInWhere_() {
        for (const key in this.query.where) {
            if (this.query.where[key] == null) {
                this.error = new LogHelper(ERROR_TYPE.NullValueInWhere, { column: key }).get();
                return;
            }
        }
    }

    private checkFetchQuery_() {
        if (this.isTableExist_(this.query.from) === true) {
            if (this.query.where != null) {
                this.checkForNullInWhere_();
                if (this.error == null) {
                    this.addGreatAndLessToNotOp_();
                }
            }

        }
        else {
            this.error = new LogHelper(ERROR_TYPE.TableNotExist, { tableName: this.query.from }).get();
        }
    }

    private isTableExist_(tableName: string): boolean {
        const index = this.activeDb_.tables.findIndex(table => table.name === tableName);
        return index >= 0;
    }

    private get activeDb_() {
        return IdbHelper.activeDb;
    }

    private getTable_(tableName: string) {
        return IdbHelper.getTable(tableName);
    }

    private addGreatAndLessToNotOp_() {
        const whereQuery = this.query.where;
        const containsNot = (qry: object, keys: string[]) => {
            return keys.findIndex(key => qry[key][QUERY_OPTION.NotEqualTo] != null) >= 0;
        };
        const addToSingleQry = (qry, keys: string[]) => {
            let value;
            keys.forEach((prop) => {
                value = qry[prop];
                if (value[QUERY_OPTION.NotEqualTo] != null) {
                    qry[prop][QUERY_OPTION.GreaterThan] = value[QUERY_OPTION.NotEqualTo];
                    if (qry[QUERY_OPTION.Or] === undefined) {
                        qry[QUERY_OPTION.Or] = {};
                        qry[QUERY_OPTION.Or][prop] = {};
                    }
                    else if (qry[QUERY_OPTION.Or][prop] === undefined) {
                        qry[QUERY_OPTION.Or][prop] = {};
                    }
                    qry[QUERY_OPTION.Or][prop][QUERY_OPTION.LessThan] = value[QUERY_OPTION.NotEqualTo];
                    delete qry[prop][QUERY_OPTION.NotEqualTo];
                }
            });
            return qry;
        };
        switch (getDataType(whereQuery)) {
            case DATA_TYPE.Object:
                const queryKeys = Object.keys(whereQuery);
                if (containsNot(whereQuery, queryKeys)) {
                    if (queryKeys.length === 1) {
                        this.query.where = addToSingleQry(whereQuery, queryKeys);
                    }
                    else {
                        const whereTmpQry = [];
                        queryKeys.forEach((prop) => {
                            whereTmpQry.push(addToSingleQry({ [prop]: whereQuery[prop] }, [prop]));
                        });
                        this.query.where = whereTmpQry;
                    }
                }
                break;
            default:
                const whereTmp = [];
                (whereQuery as object[]).forEach(qry => {
                    const qryKeys = Object.keys(qry);
                    if (containsNot(qry, qryKeys)) {
                        qry = addToSingleQry(qry, qryKeys);
                    }
                    whereTmp.push(qry);
                });
                this.query.where = whereTmp;
        }
    }

    

}