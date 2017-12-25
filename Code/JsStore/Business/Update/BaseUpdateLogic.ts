namespace JsStore {
    export namespace Business {
        export namespace Update {
            export var updateValue = function (suppliedValue, storedValue) {
                for (var key in suppliedValue) {
                    if (typeof suppliedValue[key] != 'object') {
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
            }
        }

        export class BaseUpdate extends Base {
            _checkFlag = false;
        }
    }
}