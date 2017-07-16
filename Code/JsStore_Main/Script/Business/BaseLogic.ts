module JsStore {
    export module Business {
        export class BaseLogic {
            Error: IError;
            ErrorOccured: boolean = false;
            ErrorCount = 0;
            RowAffected = 0;
            OnSuccess: Function;
            OnError: Function;
            Transaction: IDBTransaction;
            ObjectStore: IDBObjectStore;

            protected onErrorOccured = function (e, customError = false) {
                ++this.ErrorCount;
                if (this.ErrorCount == 1) {
                    if (this.OnError != null) {
                        if (!customError) {
                            this.OnError((e as any).target.error);
                        }
                        else {
                            this.OnError(e);
                        }
                    }
                }
            }

            protected isNull = function (value) {
                return value == null || value.length == 0;
            }

        }
    }

}
