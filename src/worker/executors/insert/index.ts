export * from "./values_checker";
import { InsertQuery, promise, promiseAll, TStringAny, API } from "@/common";
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

        let objectStore: IDBObjectStore;
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
        if (query.upsert) {
            addMethod = (value) => {
                return objectStore.put(value);
            };
        }
        else {
            addMethod = (value) => {
                return objectStore.add(value);
            };
        }

        if (!this.isTxQuery) {
            this.util.createTransaction(
                [query.into, MetaHelper.tableName],
            )
        }
        objectStore = this.util.objectStore(this.tableName);

        return promiseAll(
            query.values.map(function (value) {
                return promise(function (res, rej) {
                    const addResult = addMethod(value);
                    addResult.onerror = (err) => {
                        if (!query.ignore) {
                            rej(err);
                        } else {
                            res();
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