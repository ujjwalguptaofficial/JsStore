export * from "./values_checker";
import { InsertQuery, promise, promiseAll, TStringAny } from "@/common";
import { Base } from "@worker/executors/base";
import { IDBUtil } from "@/worker/idb_util";
import { QueryHelper } from "@worker/executors/query_helper";
import { DbMeta } from "@/worker/model";
import { getError } from "@/worker/utils";

export class Insert extends Base {

    query: InsertQuery;

    private valuesAffected_ = [];

    constructor(query: InsertQuery, util: IDBUtil) {
        super();
        this.query = query;
        this.idb = util;
    }

    execute(db: DbMeta) {
        const err = new QueryHelper(db).checkInsertQuery(this.query as InsertQuery);
        if (err) return Promise.reject(getError(err, true));
        return this.insertData_();
    }

    private onQueryFinished_() {
        return this.query.return ? this.valuesAffected_ : this.rowAffected;
    }

    private insertData_() {

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
        return promise<TStringAny[] | number>((res, rej) => {
            const onError = (err) => {
                this.idb.abortTransaction();
                rej(getError(err));
            }
            this.idb.createTransaction(
                [this.query.into],
            ).catch(onError);
            objectStore = this.idb.objectStore(this.tableName);

            promiseAll(
                this.query.values.map(function (value) {
                    return promise(function (res, rej) {
                        const addResult = addMethod(value);
                        addResult.onerror = onError;
                        addResult.onsuccess = function () {
                            onInsertData(value);
                            res();
                        };
                    });
                })
            ).then(() => {
                res(this.onQueryFinished_());
            }).catch(onError)
        })

    }
}