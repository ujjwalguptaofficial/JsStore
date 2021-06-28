import { getDataType } from "@worker/utils";
import { DATA_TYPE } from "@/common";

export const updateValue = (setValue, storedValue) => {
    for (const key in setValue) {
        const columnSetValue = setValue[key];
        if (getDataType(columnSetValue) !== DATA_TYPE.Object) {
            storedValue[key] = columnSetValue;
        }
        else {
            for (const op in columnSetValue) {
                switch (op as any) {
                    case '+': storedValue[key] += columnSetValue[op]; break;
                    case '-': storedValue[key] -= columnSetValue[op]; break;
                    case '*': storedValue[key] *= columnSetValue[op]; break;
                    case '/': storedValue[key] /= columnSetValue[op]; break;
                    case '{push}': storedValue[key].push(columnSetValue[op]); break;
                    default: storedValue[key] = columnSetValue;
                }
                break;
            }
        }
    }
    return storedValue;
};