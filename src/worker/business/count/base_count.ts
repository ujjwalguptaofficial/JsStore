import { WhereBase } from "../where_base";
import { CountQuery } from "../../types";

export class BaseCount extends WhereBase {
    resultCount = 0;
    query: CountQuery;

    protected onQueryFinished() {
        if (this.isTransaction === true) {
            this.onTransactionCompleted_();
        }
    }

    protected onTransactionCompleted_ = () => {
        if (this.error == null) {
            this.onSuccess(this.resultCount);
        }
        else {
            this.onError(this.error);
        }
    }
}
