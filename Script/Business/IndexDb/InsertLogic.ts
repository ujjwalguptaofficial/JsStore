module JsStorage {
    export module Business {
        export module IndexDb {
            export class InsertLogic {
                constructor(tableName: string, values, onSuccess: Function, onError: Function) {
                    try {
                        tableName = tableName.toLowerCase();
                        var TotalRowsAffected = 0,
                            Store: IDBObjectStore = DbConnection.transaction([tableName], "readwrite").objectStore(tableName);
                        values.forEach(function (value) {
                            var AddResult = Store.add(value);
                            AddResult.onerror = function (e) {
                                if (onError != null) {
                                    onError((e as any).target.error, TotalRowsAffected);
                                }
                            }
                            AddResult.onsuccess = function (e) {
                                ++TotalRowsAffected
                                if (values.length == TotalRowsAffected) {
                                    if (onSuccess != null) {
                                        onSuccess(TotalRowsAffected);
                                    }
                                }
                            }
                        })
                    }
                    catch (ex) {
                        console.error(ex);
                    }
                }

                
            }
        }
    }
}