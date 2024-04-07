import { getLength, getObjectFirstKey } from "@/worker/utils";

export function isWhereKeysLengthOne(where) {
    let status = getLength(where) === 1;
    if (status) {
        const key = getObjectFirstKey(where);
        status = getLength(where[key]) === 1;
    }
    return status;
};