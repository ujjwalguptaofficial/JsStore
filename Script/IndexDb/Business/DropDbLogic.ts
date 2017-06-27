module JsStore {
    export module IndexDb {
        export module Business {
            export class DropDbLogic {
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
                        if (onSuccess != null) {
                            onSuccess();
                        }
                    }

                }
            }
        }
    }
}