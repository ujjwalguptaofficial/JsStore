import { ERROR_TYPE, IError } from "../common/index";
export declare class LogHelper implements IError {
    type: ERROR_TYPE;
    message: string;
    private _info;
    constructor(type: ERROR_TYPE, info?: any);
    throw(): void;
    static log(msg: any): void;
    logError(): void;
    logWarning(): void;
    get(): IError;
    private getMsg;
}
