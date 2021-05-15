import { DATA_TYPE } from "@/common";

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
            if (value instanceof Date) {
                return DATA_TYPE.DateTime;
            }
    }
    return type;
}