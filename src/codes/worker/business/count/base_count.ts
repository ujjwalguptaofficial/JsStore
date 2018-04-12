import { Base } from "../base";
import { ICount } from "../../interfaces";

export class BaseCount extends Base {
    resultCount = 0;
    query: ICount;

    protected onQueryFinished() {
        if (this.isTransaction === true) {
            this.onTransactionCompleted_();
        }
    }

    protected onTransactionCompleted_ = () => {
        if (this.errorOccured === false) {
            this.onSuccess(this.resultCount);
        }
    }
}
