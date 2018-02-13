namespace JsStore {
    export namespace Business {
        export namespace Update {
            export var updateValue = function (suppliedValue, storedValue) {
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
        }

        export class BaseUpdate extends Base {
            _checkFlag = false;
            protected initTransaction() {
                createTransaction([this._query.In], this.onTransactionCompleted.bind(this));
                this._objectStore = db_transaction.objectStore(this._query.In);
            }

            private onQueryFinished() {
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
    }
}