import { Base } from "../base";
import { IdbHelper } from "../idb_helper";

export const updateValue = (suppliedValue, storedValue) => {
    for (const key in suppliedValue) {
        if (typeof suppliedValue[key] !== 'object') {
            storedValue[key] = suppliedValue[key];
        }
        else {
            for (const op in suppliedValue[key]) {
                switch (op as any) {
                    case '+': storedValue[key] += suppliedValue[key][op]; break;
                    case '-': storedValue[key] -= suppliedValue[key][op]; break;
                    case '*': storedValue[key] *= suppliedValue[key][op]; break;
                    case '/': storedValue[key] /= suppliedValue[key][op]; break;
                    default: storedValue[key] = suppliedValue[key];
                }
                break;
            }
        }
    }
    return storedValue;
};

export class BaseUpdate extends Base {
    checkFlag = false;
    protected initTransaction() {
        IdbHelper.createTransaction([this.query.in], this.onTransactionCompleted_);
        this.objectStore = IdbHelper.transaction.objectStore(this.query.in);
    }

    protected onQueryFinished() {
        if (this.isTransaction === true) {
            this.onTransactionCompleted_();
        }
    }

    private onTransactionCompleted_() {
        if (this.errorOccured === false) {
            this.onSuccess(this.rowAffected);
        }
    }
}
