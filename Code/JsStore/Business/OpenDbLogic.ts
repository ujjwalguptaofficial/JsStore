module JsStore {
    export module Business {
        export class OpenDb {
            constructor(dbVersion, onSuccess: Function, onError: Function) {
                if (ActiveDataBase.Name.length > 0) {
                    var DbRequest = indexedDB.open(ActiveDataBase.Name, dbVersion),
                        That = this;
                    DbRequest.onerror = function (event) {
                        if (onError != null) {
                            onError((event as any).target.error);
                        }
                    };

                    DbRequest.onsuccess = function (event) {
                        Status.ConStatus = ConnectionStatus.Connected;
                        DbConnection = DbRequest.result;
                        DbConnection.onclose = function () {
                            Status.ConStatus = ConnectionStatus.Closed;
                            Status.LastError = "Connection Closed, trying to reconnect";
                        }

                        DbConnection.onversionchange = function (e) {
                            if (e.newVersion === null) { // An attempt is made to delete the db
                                e.target.close(); // Manually close our connection to the db
                            }
                        };

                        DbConnection.onerror = function (e) {
                            Status.LastError = "Error occured in connection :" + e.target.result;
                        }

                        DbConnection.onabort = function (e) {
                            Status.ConStatus = ConnectionStatus.Closed;
                            Status.LastError = "Connection Aborted";
                        }

                        if (onSuccess != null) {
                            onSuccess();
                        }
                    };
                }
                else {
                    var Error = "Database name is not supplied.";
                    throwError(Error);
                }
            }
        }
    }
}
