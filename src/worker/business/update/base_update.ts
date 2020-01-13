import { Base } from "../base";
import { getDataType } from "../../utils/index";
import { DATA_TYPE, UpdateQuery } from "../../../common/index";

export const updateValue = (suppliedValue, storedValue) => {
    for (const key in suppliedValue) {
        if (getDataType(suppliedValue[key]) !== DATA_TYPE.Object) {
            storedValue[key] = suppliedValue[key];
        }
        else {
            for (const op in suppliedValue[key]) {
                switch (op as any) {
                    case '+': storedValue[key] += suppliedValue[key][op]; break;
                    case '-': storedValue[key] -= suppliedValue[key][op]; break;
                    case '*': storedValue[key] *= suppliedValue[key][op]; break;
                    case '/': storedValue[key] /= suppliedValue[key][op]; break;
                    case '{push}': storedValue[key].push(suppliedValue[key][op]); break;
                    default: storedValue[key] = suppliedValue[key];
                }
                break;
            }
        }
    }
    return storedValue;
};

export class BaseUpdate extends Base {
    query: UpdateQuery;
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
        if (this.error) {
            this.onError(this.error);
        }
        else {
            this.onSuccess(this.rowAffected);
        }
    }
}
