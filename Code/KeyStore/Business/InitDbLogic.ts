module KeyStore {
    export module Business {
        export class InitDb {
            constructor(dbName: string, tableName: string, onSuccess: Function, onError: Function) {
                var That = this,
                    DbRequest;
                try {
                    DbRequest = self.indexedDB.open(dbName, 1);
                }
                catch (ex) {
                    JsStore.Status = {
                        ConStatus: JsStore.ConnectionStatus.IndexedDbUndefined,
                        LastError: 'Your browser doesnot support IndexedDb'
                    }
                }

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
                        Status.LastError = "Connection Closed";
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
                        Status.LastError = "Connection aborted";
                    }

                    if (onSuccess != null) {
                        onSuccess();
                    }
                };

                DbRequest.onupgradeneeded = function (event) {
                    var db = (<any>event).target.result,
                        Column = "Key";
                    db.createObjectStore(tableName, {
                        keyPath: Column
                    }).createIndex(Column, Column, { unique: true });
                }
            }
        }
    }
}