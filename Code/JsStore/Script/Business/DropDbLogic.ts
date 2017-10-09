module JsStore {
    export module Business {
        export class DropDb {
            constructor(name: string, onSuccess: Function, onError: Function) {
                var That = this;
                DbConnection.close();
                setTimeout(function () {
                    That.deleteDb(name, onSuccess, onError);
                }, 100);
            }

            deleteDb = function (name: string, onSuccess: Function, onError: Function) {
                var DbDropRequest = indexedDB.deleteDatabase(name);
                DbDropRequest.onblocked = function () {
                    if (onError != null) {
                        onError("database is blocked, cant be deleted right now.");
                    };
                };
                DbDropRequest.onerror = function (e) {
                    if (onError != null) {
                        onError((event as any).target.error);
                    }
                }
                DbDropRequest.onsuccess = function () {
                    Status.ConStatus = ConnectionStatus.Closed;
                    KeyStore.remove('JsStore_' + ActiveDataBase.Name + '_Db_Version');
                    ActiveDataBase.Tables.forEach(function (table: Model.Table) {
                        KeyStore.remove("JsStore_" + ActiveDataBase.Name + "_" + table.Name + "_Version");
                        table.Columns.forEach(function (column: Column) {
                            if (column.AutoIncrement) {
                                KeyStore.remove("JsStore_" + ActiveDataBase.Name + "_" + table.Name + "_" + column.Name + "_Value");
                            }
                        });
                    });
                    KeyStore.remove("JsStore_" + ActiveDataBase.Name + "_Schema");
                    onSuccess();
                }
            }
        }
    }
}
