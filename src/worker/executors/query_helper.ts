import { InsertQuery, DATA_TYPE, ERROR_TYPE, SelectQuery, QUERY_OPTION, UpdateQuery, API } from "@/common";
import { LogHelper, getDataType } from "@/worker/utils";
import { DbMeta } from "../model";
import { ValuesChecker } from "@worker/executors/insert";
import { SchemaChecker } from "./update/schema_checker";

export class QueryHelper {
    db: DbMeta;

    constructor(dbSchema: DbMeta) {
        this.db = dbSchema;
    }

    validate(api: API, query: InsertQuery | SelectQuery | UpdateQuery) {
        switch (api) {
            case API.Select:
            case API.Remove:
            case API.Count:
                return this.checkSelect(query as SelectQuery);
            case API.Insert:
                return this.checkInsertQuery(query as InsertQuery);
            case API.Update:
                return this.checkUpdate(query as UpdateQuery);
        }
    }

    private getTable_(tableName: string) {
        return this.db.tables.find(q => q.name === tableName);
    }

    isInsertQryValid(query: InsertQuery) {
        const table = this.getTable_(query.into);
        let log: LogHelper;
        if (table) {
            switch (getDataType(query.values)) {
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
            log = new LogHelper(ERROR_TYPE.TableNotExist, { tableName: query.into });
        }
        return {
            table, log
        };
    }

    private checkUpdate(query: UpdateQuery) {
        let err = new SchemaChecker(this.getTable_(query.in)).
            check(query.set, query.in);
        if (err) return err;
        if (query.where != null) {
            err = this.checkForNullInWhere_(query);
            if (err) return err;
            this.addGreatAndLessToNotOp_(query as any);
        }
    }

    private checkSelect(query: SelectQuery) {
        const table = this.getTable_(query.from);
        if (!table) {
            return new LogHelper(ERROR_TYPE.TableNotExist,
                { tableName: query.from }
            );
        }

        if (query.where) {
            const err = this.checkForNullInWhere_(query);
            if (err) return err;
            this.addGreatAndLessToNotOp_(query);
        }
    }

    private checkForNullInWhere_(query): LogHelper {
        for (const columnName in query.where) {
            if (query.where[columnName] == null) {
                return new LogHelper(ERROR_TYPE.NullValueInWhere, { column: columnName });
            }
        }
    }

    private addGreatAndLessToNotOp_(query: SelectQuery) {
        const whereQuery = query.where;
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
                        query.where = addToSingleQry(whereQuery, queryKeys);
                    }
                    else {
                        const whereTmpQry = [];
                        queryKeys.forEach((prop) => {
                            whereTmpQry.push(addToSingleQry({ [prop]: whereQuery[prop] }, [prop]));
                        });
                        query.where = whereTmpQry;
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
                query.where = whereTmp;
        }
    }

    private checkInsertQuery(query: InsertQuery) {
        const validResult = this.isInsertQryValid(query);
        let table = validResult.table;
        const error = validResult.log;
        if (error) return error;
        if (query.skipDataCheck) return;
        const valueCheckerInstance = new ValuesChecker(table, table.autoIncColumnValue);
        const { values, err } = valueCheckerInstance.checkAndModifyValues(query);
        query.values = values;
        return err;
    }
}