namespace JsStore {
    export namespace Business {
        export class DropDb {
            constructor(name: string, onSuccess: () => void, onError: (err: IError) => void) {
                setTimeout(function () {
                    this.deleteDb(name, onSuccess, onError);
                }.bind(this), 100);
            }

            deleteDb = function (name: string, onSuccess: () => void, onError: (err: any) => void) {
                var db_drop_request = indexedDB.deleteDatabase(name);
                db_drop_request.onblocked = function () {
                    if (onError != null) {
                        onError("database is blocked, cant be deleted right now.");
                    }
                };
                db_drop_request.onerror = function (e) {
                    if (onError != null) {
                        onError((event as any).target.error);
                    }
                };
                db_drop_request.onsuccess = function () {
                    status.ConStatus = Connection_Status.Closed;
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
                    KeyStore.remove("JsStore_" + active_db._name + "_Schema", onSuccess);
                };
            };
        }
    }
}
