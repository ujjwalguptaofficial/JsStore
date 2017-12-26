namespace JsStore {
    export namespace Business {
        export class OpenDb {
            constructor(dbVersion, onSuccess: () => void, onError: (err: IError) => void) {
                if (active_db._name.length > 0) {
                    var db_request = indexedDB.open(active_db._name, dbVersion),
                        that = this;

                    db_request.onerror = function (event) {
                        if (onError != null) {
                            onError((event as any).target.error);
                        }
                    };

                    db_request.onsuccess = function (event) {
                        status.ConStatus = ConnectionStatus.Connected;
                        db_connection = db_request.result;
                        (db_connection as any).onclose = function () {
                            status.ConStatus = ConnectionStatus.Closed;
                            status.LastError = "Connection Closed, trying to reconnect";
                        };

                        db_connection.onversionchange = function (e) {
                            if (e.newVersion === null) { // An attempt is made to delete the db
                                (e.target as any).close(); // Manually close our connection to the db
                            }
                        };

                        db_connection.onerror = function (e) {
                            status.LastError = "Error occured in connection :" + (e.target as any).result;
                        };

                        db_connection.onabort = function (e) {
                            status.ConStatus = ConnectionStatus.Closed;
                            status.LastError = "Connection Aborted";
                        };

                        if (onSuccess != null) {
                            onSuccess();
                        }
                    };
                }
                else {
                    var error = "Database name is not supplied.";
                    throwError(error);
                }
            }
        }
    }
}
