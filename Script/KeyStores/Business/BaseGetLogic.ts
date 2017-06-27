module JsStore {
    export module KeyStores {
        export module Business {
            export class BaseGetLogic {
                Results;
                OnSuccess: Function;
                OnError: Function;
                ErrorOccured: boolean = false;
                ErrorCount = 0;
                Transaction: IDBTransaction;
                ObjectStore: IDBObjectStore;

                public onErrorRequest = function (e) {
                    ++this.ErrorCount;
                    if (this.ErrorCount == 1) {
                        if (this.OnError != null) {
                            this.OnError((e as any).target.error);
                        }
                    }
                    console.error(e);
                }
            }
        }
    }
}