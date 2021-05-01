import { ERROR_TYPE } from "@/common"
import { getError } from "./get_error";

export const getErrorFromException = (ex, type = ERROR_TYPE.InvalidQuery) => {
    ex.name = type;
    return getError(ex);
}