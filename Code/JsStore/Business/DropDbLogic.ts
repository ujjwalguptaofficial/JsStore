namespace JsStore {
    export namespace Business {
        export class DropDb {
            constructor(name: string, onSuccess: Function, onError: Function) {
                var That = this;
                db_connection.close();
                setTimeout(function () {
                    That.deleteDb(name, onSuccess, onError);
                }, 100);
            }

            deleteDb = function (name: string, onSuccess: Function, onError: Function) {
                var DbDropRequest = indexedDB.deleteDatabase(name);
                DbDropRequest.onblocked = function () {
                    if (onError != null) {
                        onError("database is blocked, cant be deleted right now.");
                    }
                };
                DbDropRequest.onerror = function (e) {
                    if (onError != null) {
                        onError((event as any).target.error);
                    }
                };
                DbDropRequest.onsuccess = function () {
                    status.ConStatus = ConnectionStatus.Closed;
                    KeyStore.remove('JsStore_' + active_db._name + '_Db_Version');
                    active_db._tables.forEach(function (table: Model.Table) {
                        KeyStore.remove("JsStore_" + active_db._name + "_" + table._name + "_Version");
                        table._columns.forEach(function (column: Column) {
                            if (column._autoIncrement) {
                                KeyStore.remove(
                                    "JsStore_" + active_db._name + "_" + table._name + "_" + column._name + "_Value"
                                );
                            }
                        });
                    });
                    KeyStore.remove("JsStore_" + active_db._name + "_Schema");
                    onSuccess();
                };
            };
        }
    }
}
