import { Data_Type } from "./enums";

export class Util {
    static isNull(value) {
        if (value == null) {
            return true;
        } else {
            switch (typeof value) {
                case 'string': return value.length === 0;
                case 'number': return isNaN(value);
            }
        }
        return false;
    }

    static getObjectFirstKey(value) {
        for (var key in value) {
            return key;
        }
        return null;
    }

    /**
     *  get data type of supplied value
     * 
     * @static
     * @param {any} value 
     * @returns 
     * @memberof Util
     */
    static getType(value) {
        if (value === null) {
            return Data_Type.Null;
        }
        var type = typeof value;
        switch (type) {
            case 'object':
                if (Array.isArray(value)) {
                    return Data_Type.Array;
                }
            default:
                return type;
        }
    }
}