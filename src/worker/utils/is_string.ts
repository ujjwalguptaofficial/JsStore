import { DATA_TYPE } from "../enums";

export const isString = (value) => {
    return typeof value === DATA_TYPE.String;
};