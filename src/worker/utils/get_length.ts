import { getKeys } from "./get_keys"

export const getLength = (value): number => {
    return getKeys(value).length;
}