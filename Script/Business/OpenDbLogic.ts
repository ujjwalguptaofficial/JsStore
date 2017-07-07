module JsStore {
    export module Business {
        export class OpenDbLogic {
            constructor(objMain: Instance, onSuccess: Function, onError: Function) {
                if (Status.ConStatus != ConnectionStatus.Connected) {
                    if (ActiveDataBase.Name.length > 0) {
                        var DbVersion = Number(localStorage.getItem(ActiveDataBase.Name + 'Db_Version')),
                            DbRequest = window.indexedDB.open(ActiveDataBase.Name, DbVersion),
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
                                onSuccess(objMain);
                            }
                        };
                    }
                    else {
                        if (onError != null) {
                            onError(<IError>{
                                Name: "DbNotFound",
                                Value: "DataBase name is not found, please first initiate the db using createDb"
                            });
                        }
                    }
                }
                else {
                    if (onSuccess != null) {
                        onSuccess();
                    }
                }
            }
        }
    }
}
