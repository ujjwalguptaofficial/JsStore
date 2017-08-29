module JsStore {
    export module Business {
        export module Update {

            export var updateValue = function (suppliedValue, storedValue) {
                for (var key in suppliedValue) {
                    for (var op in suppliedValue[key]) {
                        switch (op as any) {
                            case 0: storedValue[key] = suppliedValue[key]; break;
                            case '+': storedValue[key] += suppliedValue[key][op]; break;
                            case '-': storedValue[key] -= suppliedValue[key][op]; break;
                            case '*': storedValue[key] *= suppliedValue[key][op]; break;
                            case '/': storedValue[key] /= suppliedValue[key][op]; break;
                            default: storedValue[key] = suppliedValue;
                        }
                        break;
                    }
                }
                return storedValue;
            }
        }

        export class BaseUpdate extends Base {
            SendResultFlag: Boolean = true;
            CheckFlag = false;
        }
    }
}