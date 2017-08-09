module KeyStore {
    export module Business {
        export class Base {
            Results = null;
            OnSuccess: Function;
            OnError: Function;
            ErrorOccured: boolean = false;
            ErrorCount = 0;
            Transaction: IDBTransaction;
            ObjectStore: IDBObjectStore;

            protected onErrorOccured = function (e) {
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