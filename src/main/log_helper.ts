
import { ERROR_TYPE, IError } from "../common/index";

export class LogHelper implements IError {
    type: string;
    message: string;
    private _info: any;
    status: boolean;

    constructor(type: string, info?) {
        this.type = type;
        this._info = info;
        this.message = this.getMsg();
    }

    throw() {
        throw this;
    }

    log(msg) {
        if (this.status) {
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
            default:
                errMsg = this.message;
                break;
        }
        return errMsg;
    }
}