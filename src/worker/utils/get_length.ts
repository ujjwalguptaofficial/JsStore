import { getKeys } from "./get_keys"

export const getLength = (value): Number => {
    return getKeys(value).length;
}