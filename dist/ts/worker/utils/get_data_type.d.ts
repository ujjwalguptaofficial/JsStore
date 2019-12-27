import { DATA_TYPE } from "../../common/index";
export declare const getDataType: (value: any) => "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | DATA_TYPE.Array | DATA_TYPE.Null | DATA_TYPE.DateTime;
