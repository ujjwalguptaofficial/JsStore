import { Base } from "../base";

export class BaseCount extends Base {
    _resultCount = 0;
    _skipRecord;
    _limitRecord;
    checkFlag = false;

    protected onQueryFinished() {
        if (this.isTransaction === true) {
            this.onTransactionCompleted();
        }
    }

    protected onTransactionCompleted() {
        if (this.errorOccured === false) {
            this.onSuccess(this._resultCount);
        }
    }
}
