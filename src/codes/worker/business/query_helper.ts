import { API, ERROR_TYPE, QUERY_OPTION, DATA_TYPE } from "../enums";
import { IdbHelper } from "./idb_helper";
import { IError } from "../interfaces";
import { LogHelper } from "../log_helper";
import { Util } from "../util";
import * as Update from "./update/index";

export class QueryHelper {
    api: API;
    query;
    error: IError;
    constructor(api: API, query: any) {
        this.api = api;
        this.query = query;
    }
    checkAndModify() {
        switch (this.api) {
            case API.Select:
            case API.Remove:
            case API.Count:
                this.checkFetchQuery_();
                break;
            case API.Update:
                this.checkUpdateQuery_();
                break;
            default:
                throw new Error("invalid api");

        }
    }

    private checkUpdateQuery_() {
        this.error = new Update.SchemaChecker(this.getTable_(this.query.in)).
            check(this.query.set, this.query.in);
        if (this.error == null) {
            this.addGreatAndLessToNotOp_();
        }
    }

    private checkFetchQuery_() {
        if (this.isTableExist_(this.query.from) === true) {
            if (this.query.where !== undefined) {
                this.addGreatAndLessToNotOp_();
            }
        }
        else {
            this.error = new LogHelper(ERROR_TYPE.TableNotExist, { TableName: this.query.from }).get();
        }
    }

    private isTableExist_(tableName: string): boolean {
        const index = this.activeDb_.tables.findIndex(table => table.name === tableName);
        return index >= 0 ? true : false;
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
        switch (this.getType_(whereQuery)) {
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

    private getType_(value) {
        return Util.getType(value);
    }
}