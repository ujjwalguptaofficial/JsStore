module JsStore {
    export module Business {
        export class DropDb {
            constructor(name: string, onSuccess: Function, onError: Function) {

                var DbDropRequest = window.indexedDB.deleteDatabase(name);
                DbDropRequest.onblocked = function () {
                    if (onError != null) {
                        onError("delete database is in progress");
                    };
                };
                DbDropRequest.onerror = function (e) {
                    if (onError != null) {
                        onError((event as any).target.error);
                    }
                }
                DbDropRequest.onsuccess = function () {
                    Status.ConStatus = ConnectionStatus.Closed;
                    KeyStore.remove('JsStore_' + ActiveDataBase.Name + '_Db_Version');
                    ActiveDataBase.Tables.forEach(function (item: Model.ITable) {
                        KeyStore.remove("JsStore_" + ActiveDataBase.Name + "_" + item.Name);
                    });
                    if (onSuccess != null) {
                        onSuccess();
                    }
                }

            }
        }
    }
}
