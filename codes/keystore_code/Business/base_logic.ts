import { IError } from "../interfaces";

export class Base {
    _results = null;
    _onSuccess: (results) => void;
    _onError: (err: IError) => void;
    _errorOccured: boolean = false;
    _errorCount = 0;
    _transaction: IDBTransaction;
    _objectStore: IDBObjectStore;

    protected onErrorOccured(e) {
        ++this._errorCount;
        if (this._errorCount === 1) {
            if (this._onError != null) {
                this._onError((e as any).target.error);
            }
        }
        console.error(e);
    }
}