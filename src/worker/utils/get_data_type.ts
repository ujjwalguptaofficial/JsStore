import { DATA_TYPE } from "../../common/index";

export const getDataType = (value) => {
    if (value == null) {
        return DATA_TYPE.Null;
    }
    const type = typeof value;
    switch (type) {
        case 'object':
            if (Array.isArray(value)) {
                return DATA_TYPE.Array;
            }
            else if (value.getDate && value.getTime) {
                return DATA_TYPE.DateTime;
            }
        default:
            return type;
    }
}