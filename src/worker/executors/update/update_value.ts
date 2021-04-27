import { getDataType } from "@worker/utils";
import { DATA_TYPE } from "@/common";

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