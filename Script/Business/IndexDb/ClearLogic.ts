module JsStorage {
    export module Business {
        export module IndexDb {
            export class ClearLogic {
                constructor(tableName: string, onSuccess: Function, onError: Function) {
                    var ObjectStore: IDBObjectStore = DbConnection.transaction([query.In], "readwrite").Transaction.objectStore(tableName)
                        , ClearRequest = ObjectStore.clear();

                    ClearRequest.onsuccess = function (e) {
                        if (onSuccess != null) {
                            onSuccess();
                        }
                    }

                    ClearRequest.onerror = function (e) {
                        if (onError != null) {
                            onError();
                        }
                    }
                }
            }
        }
    }
}
