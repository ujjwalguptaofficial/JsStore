import { Base } from "../base";
import { IdbHelper } from "../idb_helper";

export var updateValue = (suppliedValue, storedValue) => {
    for (var key in suppliedValue) {
        if (typeof suppliedValue[key] !== 'object') {
            storedValue[key] = suppliedValue[key];
        }
        else {
            for (var op in suppliedValue[key]) {
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
    _checkFlag = false;
    protected initTransaction() {
        IdbHelper.createTransaction([this._query.in], this.onTransactionCompleted.bind(this));
        this._objectStore = IdbHelper._transaction.objectStore(this._query.in);
    }

    protected onQueryFinished() {
        if (this._isTransaction === true) {
            this.onTransactionCompleted();
        }
    }

    private onTransactionCompleted() {
        if (this._errorOccured === false) {
            this._onSuccess(this._rowAffected);
        }
    }
}
