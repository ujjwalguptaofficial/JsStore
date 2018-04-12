import { Base } from "../base";
import { IUpdate } from "../../interfaces";
import { DATA_TYPE } from "../../enums";

export const updateValue = (suppliedValue, storedValue) => {
    for (const key in suppliedValue) {
        if (typeof suppliedValue[key] !== DATA_TYPE.Object) {
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
    query: IUpdate;
    protected initTransaction() {
        this.createTransaction([this.query.in], this.onTransactionCompleted_);
        this.objectStore = this.transaction.objectStore(this.query.in);
    }

    protected onQueryFinished() {
        if (this.isTransaction === true) {
            this.onTransactionCompleted_();
        }
    }

    private onTransactionCompleted_ = () => {
        if (this.errorOccured === false) {
            this.onSuccess(this.rowAffected);
        }
    }
}
