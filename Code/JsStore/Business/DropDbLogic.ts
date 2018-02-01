namespace JsStore {
    export namespace Business {
        export class DropDb {
            _onSuccess: () => void;
            _onError: (err: IError) => void;
            constructor(onSuccess: () => void, onError: (err: IError) => void) {
                this._onSuccess = onSuccess;
                this._onError = onError;
            }

            deleteMetaData() {
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
                KeyStore.remove("JsStore_" + active_db._name + "_Schema", this._onSuccess);
            }

            deleteDb() {
                setTimeout(function () {
                    var db_drop_request = indexedDB.deleteDatabase(active_db._name);
                    db_drop_request.onblocked = function () {
                        if (this._onError != null) {
                            this._onError("database is blocked, cant be deleted right now.");
                        }
                    }.bind(this);
                    db_drop_request.onerror = function (e) {
                        if (this._onError != null) {
                            this._onError((event as any).target.error);
                        }
                    }.bind(this);
                    db_drop_request.onsuccess = function () {
                        db_status.ConStatus = Connection_Status.Closed;
                        this.deleteMetaData();
                    }.bind(this);
                }.bind(this), 100);
            }
        }
    }
}
