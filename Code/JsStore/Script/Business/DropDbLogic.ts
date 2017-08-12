module JsStore {
    export module Business {
        export class DropDb {
            constructor(name: string, onSuccess: Function, onError: Function) {

                var DbDropRequest = window.indexedDB.deleteDatabase(name);
                DbDropRequest.onblocked = function () {
                    if (onError != null) {
                        onError("delete database is in progress");
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
                    if (onSuccess != null) {
                        onSuccess();
                    }
                }

            }
        }
    }
}
