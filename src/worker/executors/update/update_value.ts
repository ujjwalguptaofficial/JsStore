import { getDataType } from "@worker/utils";
import { DATA_TYPE, ERROR_TYPE } from "@/common";
import { type } from "os";
import { LogHelper } from "@/main/log_helper";

export const updateValue = (setValue, storedValue) => {
    for (const key in setValue) {
        const columnSetValue = setValue[key];
        if (getDataType(columnSetValue) !== DATA_TYPE.Object) {
            storedValue[key] = columnSetValue;
        }
        else {
            for (const op in columnSetValue) {
                let value = columnSetValue[op];
                if (typeof value == 'string') {
                    if (value.match(/'|"/)) {
                        value = value.replace(/'|"/g, '');
                    }
                    else if (storedValue[value]) {
                        value = storedValue[value];
                    }
                    else {
                        new LogHelper(ERROR_TYPE.InvalidUpdateColumn).throw();
                    }
                }

                switch (op as any) {
                    case '+': storedValue[key] += value; break;
                    case '-': storedValue[key] -= value; break;
                    case '*': storedValue[key] *= value; break;
                    case '/': storedValue[key] /= value; break;
                    case '{push}': storedValue[key].push(value); break;
                    default: storedValue[key] = columnSetValue;
                }
                break;
            }
        }
    }
    return storedValue;
};