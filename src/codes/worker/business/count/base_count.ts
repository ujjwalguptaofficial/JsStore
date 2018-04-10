import { Base } from "../base";

export class BaseCount extends Base {
    resultCount = 0;
    skipRecord;
    limitRecord;
    checkFlag = false;

    protected onQueryFinished() {
        if (this.isTransaction === true) {
            this.onTransactionCompleted();
        }
    }

    protected onTransactionCompleted() {
        if (this.errorOccured === false) {
            this.onSuccess(this.resultCount);
        }
    }
}
