module JsStore {
    export module Business {
        export class Clear extends Base {
            constructor(tableName: string, onSuccess: Function, onError: Function) {
                super();
                var That = this,
                    ObjectStore: IDBObjectStore = DbConnection.transaction([tableName], "readwrite").objectStore(tableName)
                    , ClearRequest = ObjectStore.clear();

                ClearRequest.onsuccess = function (e) {
                    var CurrentTable = That.getTable(tableName);
                    CurrentTable.Columns.forEach(function (column: Column) {
                        if (column.AutoIncrement) {
                            KeyStore.set("JsStore_" + ActiveDataBase.Name + "_" + tableName + "_" + column.Name + "_Value", 0);
                        }
                    });
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


