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
    }

    execute(db: DbMeta) {
        const err = new QueryHelper(db).validate(API.Insert, this.query);
        if (err) return Promise.reject(getError(err, true));
        return this.insertData_(db).then(_ => {
            return this.query.return ? this.valuesAffected_ : this.rowAffected
        }).catch(err => {
            this.util.abortTransaction();
            return promiseReject(getError(err));
        })
    }

    private insertData_(db: DbMeta) {

        let objectStore: IDBObjectStore;
        let onInsertData;
        let addMethod;

        if (this.query.return) {
            onInsertData = (value) => {
                this.valuesAffected_.push(value);
            };

        }
        else {
            onInsertData = (value) => {
                ++this.rowAffected;
            };
        }
        if (this.query.upsert) {
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
                [this.query.into, MetaHelper.tableName],
            )
        }
        objectStore = this.util.objectStore(this.tableName);

        return promiseAll(
            this.query.values.map(function (value) {
                return promise(function (res, rej) {
                    const addResult = addMethod(value);
                    addResult.onerror = rej;
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