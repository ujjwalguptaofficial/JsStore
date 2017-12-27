namespace KeyStore {
    export namespace Business {
        export class InitDb {
            constructor(dbName: string, tableName: string, onSuccess: () => void, onError: (err: IError) => void) {
                var db_request = self.indexedDB.open(dbName, 1);
                db_request.onerror = function (event) {
                    if ((event as any).target.error.name === 'InvalidStateError') {
                        JsStore.status = {
                            ConStatus: JsStore.Connection_Status.UnableToStart,
                            LastError: JsStore.Error_Type.IndexedDbBlocked,
                        };
                    }
                    if (onError != null) {
                        onError((event as any).target.error);
                    }
                };

                db_request.onsuccess = function (event) {
                    status.ConStatus = ConnectionStatus.Connected;
                    db_connection = db_request.result;
                    db_connection.onclose = function () {
                        status.ConStatus = ConnectionStatus.Closed;
                        status.LastError = "Connection Closed";
                    };

                    db_connection.onversionchange = function (e) {
                        if (e.newVersion === null) { // An attempt is made to delete the db
                            e.target.close(); // Manually close our connection to the db
                        }
                    };

                    db_connection.onerror = function (e) {
                        status.LastError = "Error occured in connection :" + e.target.result;
                    };

                    db_connection.onabort = function (e) {
                        status.ConStatus = ConnectionStatus.Closed;
                        status.LastError = "Connection aborted";
                    };

                    if (onSuccess != null) {
                        onSuccess();
                    }
                };

                db_request.onupgradeneeded = function (event: any) {
                    var db = event.target.result,
                        column = "Key";
                    db.createObjectStore(tableName, {
                        keyPath: column
                    }).createIndex(column, column, { unique: true });
                };
            }
        }
    }
}