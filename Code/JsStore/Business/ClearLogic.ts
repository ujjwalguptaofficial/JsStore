namespace JsStore {
    export namespace Business {
        export class Clear extends Base {
            constructor(tableName: string, onSuccess: () => void, onError: (err: IError) => void) {
                super();
                var object_store: IDBObjectStore =
                    db_connection.transaction([tableName], "readwrite").objectStore(tableName)
                    , clear_request = object_store.clear();

                clear_request.onsuccess = function (e) {
                    var current_table = this.getTable(tableName);
                    current_table._columns.forEach(function (column: Column) {
                        if (column._autoIncrement) {
                            KeyStore.set(
                                "JsStore_" + active_db._name + "_" + tableName + "_" + column._name + "_Value",
                                0
                            );
                        }
                    });
                    if (onSuccess != null) {
                        onSuccess();
                    }
                }.bind(this);

                clear_request.onerror = function (e) {
                    if (onError != null) {
                        onError(e as any);
                    }
                };
            }
        }
    }
}
