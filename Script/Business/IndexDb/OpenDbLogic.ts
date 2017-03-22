module JsStorage {
    export module Business {
        export module IndexDb {
            export class OpenDbLogic {

                constructor(objMain: Main, onSuccess: Function, onError: Function) {
                    if (objMain.Status.ConStatus != ConnectionStatus.Connected) {
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
                                objMain.Status.ConStatus = ConnectionStatus.Connected;
                                DbConnection = DbRequest.result;
                                DbConnection.onclose = function () {
                                    objMain.Status.ConStatus = ConnectionStatus.Closed;
                                    objMain.Status.LastError = "Connection Closed, trying to reconnect";
                                }

                                DbConnection.onerror = function (e) {

                                }

                                DbConnection.onabort = function (e) {
                                    objMain.Status.ConStatus = ConnectionStatus.Closed;
                                    objMain.Status.LastError = "Connection Closed, trying to reconnect";
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
}