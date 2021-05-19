export * from "./values_checker";
import { InsertQuery, promise, promiseAll, TStringAny, API, IDB_MODE } from "@/common";
import { Base } from "@worker/executors/base";
import { IDBUtil } from "@/worker/idbutil";
import { QueryHelper } from "@worker/executors/query_helper";
import { DbMeta } from "@/worker/model";
import { getError, promiseReject } from "@/worker/utils";
import { MetaHelper } from "@/worker/meta_helper";

export class Insert extends Base {

    query: InsertQuery;

    private valuesAffected_ = [];

    constructor(query: InsertQuery, util: IDBUtil) {
        super();
        if (query.validation == null) {
            query.validation = true;
        }
        this.query = query;
        this.util = util;
        this.tableName = query.into;
    }

    execute(db: DbMeta) {
        const err = new QueryHelper(db).validate(API.Insert, this.query);
        if (err) return promiseReject(err);
        return this.insertData_(db).then(_ => {
            return this.query.return ? this.valuesAffected_ : this.rowAffected
        }).catch(err => {
            this.util.abortTransaction();
            return promiseReject(err);
        })
    }

    private insertData_(db: DbMeta) {

        let onInsertData;
        let addMethod;

        const query = this.query;
        if (query.return) {
            onInsertData = (value) => {
                this.valuesAffected_.push(value);
            };

        }
        else {
            onInsertData = (value) => {
                ++this.rowAffected;
            };
        }
        addMethod = (() => {
            const idbMethod = query.upsert ? "put" : "add";
            if (query.ignore && !this.isTxQuery) {
                return (value) => {
                    const tx = this.util.con.transaction(query.into, IDB_MODE.ReadWrite);
                    const objectStore = tx.objectStore(query.into);
                    return objectStore[idbMethod](value);
                };
            }
            if (!this.isTxQuery) {
                this.util.createTransaction(
                    [query.into, MetaHelper.tableName],
                )
            }
            this.objectStore = this.util.objectStore(this.tableName);
            return (value) => {
                return this.objectStore[idbMethod](value);
            };
        })();

        return promiseAll(
            query.values.map((value) => {
                return promise((res, rej) => {
                    const addResult = addMethod(value);
                    addResult.onerror = (err) => {
                        if (query.ignore) {
                            res();
                        } else {
                            rej(err);
                        }
                    }
                    addResult.onsuccess = function () {
                        onInsertData(value);
                        res();
                    };
                });
            })
        ).then(() => {
            MetaHelper.set(MetaHelper.dbSchema, db, this.util);
        });
    }
}