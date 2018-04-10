import { IError } from "./interfaces";
import { Error_Type } from "./enums";
import { Config } from "./config";

export class LogHelper implements IError {
    type: Error_Type;
    message: string;
    private _info: any;

    constructor(type: Error_Type, info: any = null) {
        this.type = type;
        this._info = info;
        this.message = this.getMsg();
    }

    throw() {
        throw this.get();
    }

    static log(msg) {
        if (Config._isLogEnabled) {
            console.log(msg);
        }
    }

    logError() {
        console.error(this.get());
    }

    logWarning() {
        console.warn(this.get());
    }

    get() {
        return {
            message: this.message,
            type: this.type
        } as IError;
    }

    private getMsg() {
        let errMsg: string;
        switch (this.type) {
            case Error_Type.WorkerNotSupplied:
                errMsg = "Worker object is not passed in instance constructor";
                break;
            case Error_Type.IndexedDbUndefined:
                errMsg = "Browser does not support indexeddb";
                break;
            default:
                errMsg = this.message;
                break;
        }
        return errMsg;
    }
}