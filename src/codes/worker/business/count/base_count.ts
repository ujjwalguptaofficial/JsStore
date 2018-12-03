import { Base } from "../base";
import { CountQuery } from "../../types";

export class BaseCount extends Base {
    resultCount = 0;
    query: CountQuery;

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
