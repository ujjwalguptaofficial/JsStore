import { DATA_TYPE } from "../../common/index";

 

export const isString = (value) => {
    return typeof value === DATA_TYPE.String;
};