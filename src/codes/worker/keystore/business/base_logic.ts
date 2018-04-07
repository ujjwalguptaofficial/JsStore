import { IError } from "../interfaces";

export class Base {
    results = null;
    onSuccess: (results) => void;
    onError: (err: IError) => void;
    errorOccured = false;
    errorCount = 0;
    transaction: IDBTransaction;
    objectStore: IDBObjectStore;

    protected onErrorOccured(e) {
        ++this.errorCount;
        if (this.errorCount === 1) {
            if (this.onError != null) {
                this.onError((e as any).target.error);
            }
        }
        console.error(e);
    }
}