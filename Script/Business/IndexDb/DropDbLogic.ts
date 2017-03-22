module JsStorage {
    export module Business {
        export module IndexDb {
            export class DropDbLogic {

                constructor(name: string, onSuccess: Function, onError: Function) {
                    var DbDropRequest = window.indexedDB.deleteDatabase(name);
                    DbDropRequest.onsuccess = function () {
                        if (onSuccess != null) {
                            onSuccess();
                        }
                    }
                    DbDropRequest.onerror = function (e) {
                        if (onError != null) {
                            onError((event as any).target.error);
                        }
                    }
                }
            }
        }
    }
}