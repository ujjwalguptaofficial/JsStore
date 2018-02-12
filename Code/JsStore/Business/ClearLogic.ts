namespace JsStore {
    export namespace Business {
        export class Clear extends Base {
            constructor(tableName: string, onSuccess: () => void, onError: (err: IError) => void) {
                super();
                this._query = tableName;
                this._onSuccess = onSuccess;
                this._onSuccess = onError;
            }

            execute() {
                createTransaction([this._query], function (e) {
                    if (this._onSuccess) {
                        this._onSuccess();
                    }
                }.bind(this));
                var clear_request: IDBRequest = db_transaction.objectStore(this._query).clear();
                clear_request.onsuccess = function (e) {
                    var current_table = this.getTable(this._query);
                    current_table._columns.forEach(function (column: Column) {
                        if (column._autoIncrement) {
                            KeyStore.set(
                                "JsStore_" + active_db._name + "_" + this._query + "_" + column._name + "_Value",
                                0
                            );
                        }
                    }, this);
                }.bind(this);

                clear_request.onerror = function (e) {
                    this._errorOccured = true;
                    this.onErrorOccured(e);
                }.bind(this);
            }
        }
    }
}
