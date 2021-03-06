import { getDataType } from "./get_data_type"
import { QUERY_OPTION, DATA_TYPE } from "@/common";

export const compare = (value, compareValue, symbol?) => {
    const type1 = getDataType(value);
    const type2 = getDataType(compareValue);

    if (type1 !== type2) return false;
    if (type1 === DATA_TYPE.DateTime) {
        value = value.getTime();
        compareValue = compareValue.getTime();
    }
    switch (symbol) {
        // greater than
        case QUERY_OPTION.GreaterThan:
            return value > compareValue;
        // less than
        case QUERY_OPTION.LessThan:
            return value < compareValue;
        // less than equal
        case QUERY_OPTION.LessThanEqualTo:
            return value <= compareValue;
        // greather than equal
        case QUERY_OPTION.GreaterThanEqualTo:
            return value >= compareValue;
        // Not equal to
        case QUERY_OPTION.NotEqualTo:
            return value !== compareValue;
        default:
            return value === compareValue;
    }
}