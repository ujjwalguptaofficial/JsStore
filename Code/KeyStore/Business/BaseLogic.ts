namespace KeyStore {
    export namespace Business {
        export class Base {
            _results = null;
            _onSuccess: (results) => void;
            _onError: (err: IError) => void;
            _errorOccured: boolean = false;
            _errorCount = 0;
            _transaction: IDBTransaction;
            _objectStore: IDBObjectStore;

            protected on_errorOccured = function (e) {
                ++this._errorCount;
                if (this._errorCount === 1) {
                    if (this.OnError != null) {
                        this.OnError((e as any).target.error);
                    }
                }
                console.error(e);
            };
        }
    }
}