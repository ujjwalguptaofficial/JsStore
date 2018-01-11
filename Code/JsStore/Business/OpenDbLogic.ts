namespace JsStore {
    export namespace Business {
        export class OpenDb {
            constructor(dbVersion, onSuccess: () => void, onError: (err: IError) => void) {
                if (active_db._name.length > 0) {
                    var db_request = indexedDB.open(active_db._name, dbVersion);

                    db_request.onerror = function (event) {
                        if (onError != null) {
                            onError((event as any).target.error);
                        }
                    };

                    db_request.onsuccess = function (event) {
                        status.ConStatus = Connection_Status.Connected;
                        db_connection = db_request.result;
                        (db_connection as any).onclose = function () {
                            status.ConStatus = Connection_Status.Closed;
                            status.LastError = Error_Type.ConnectionClosed;
                        };

                        db_connection.onversionchange = function (e) {
                            if (e.newVersion === null) { // An attempt is made to delete the db
                                (e.target as any).close(); // Manually close our connection to the db
                            }
                        };

                        db_connection.onerror = function (e) {
                            status.LastError = ("Error occured in connection :" + (e.target as any).result) as any;
                        };

                        db_connection.onabort = function (e) {
                            status.ConStatus = Connection_Status.Closed;
                            status.LastError = Error_Type.ConnectionAborted;
                        };

                        if (onSuccess != null) {
                            onSuccess();
                        }
                        this.setPrimaryKey();
                    }.bind(this);
                }
                else {
                    var error = new Error(Error_Type.UndefinedDbName);
                    error.throw();
                }
            }

            private setPrimaryKey = function () {
                active_db._tables.forEach(function (table: Table, index) {
                    table._columns.every(function (item) {
                        active_db._tables[index]._primaryKey = item._primaryKey ? item._name : "";
                        return !item._primaryKey;
                    });
                });
            };
        }
    }
}
