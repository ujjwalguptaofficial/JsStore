import { getDataType } from "./get_data_type"
import { DATA_TYPE } from "../../main";

export const isEqual = (val1, val2) => {
    const type1 = getDataType(val1);
    const type2 = getDataType(val2);

    if (type1 !== type2) return false;

    switch (type1) {
        case DATA_TYPE.DateTime:
            return val1.getTime() === val2.getTime();
        default:
            return val1 === val2;
    }
}