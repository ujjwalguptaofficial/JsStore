import { IError } from "./interfaces";
import { ERROR_TYPE } from "./enums";
import { Config } from "./config";

export class LogHelper implements IError {
    type: ERROR_TYPE;
    message: string;
    private _info: any;

    constructor(type: ERROR_TYPE, info: any = null) {
        this.type = type;
        this._info = info;
        this.message = this.getMsg();
    }

    public throw() {
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

    public get() {
        return {
            message: this.message,
            type: this.type
        } as IError;
    }

    private getMsg() {
        var err_msg: string;
        switch (this.type) {
            case ERROR_TYPE.NotArray:
                err_msg = "Supplied value is not an array";
                break;
            case ERROR_TYPE.UndefinedColumn:
                err_msg = "Column is undefined in Where";
                break;
            case ERROR_TYPE.UndefinedValue:
                err_msg = "Value is undefined in Where";
                break;
            case ERROR_TYPE.UndefinedColumnName:
                err_msg = "Column name is undefined '" + this._info['TableName'] + "'";
                break;
            case ERROR_TYPE.UndefinedDbName:
                err_msg = "Database name is not supplied";
                break;
            case ERROR_TYPE.UndefinedColumnValue:
                err_msg = "Column value is undefined";
                break;
            case ERROR_TYPE.NoValueSupplied:
                err_msg = "No value supplied";
                break;
            case ERROR_TYPE.InvalidOp:
                err_msg = "Invalid Op Value '" + this._info['Op'] + "'";
                break;
            case ERROR_TYPE.ColumnNotExist:
                err_msg = "Column '" + this._info['ColumnName'] + "' does not exist";
                break;
            case ERROR_TYPE.EnableSearchOff:
                err_msg = "Search is turned off for the Column '" + this._info['ColumnName'] + "'";
                break;
            case ERROR_TYPE.NullValue:
                err_msg = "Null value is not allowed for column '" + this._info['ColumnName'] + "'";
                break;
            case ERROR_TYPE.BadDataType:
                err_msg = "Supplied value for column '" + this._info['ColumnName'] +
                    "' does not have valid type";
                break;
            case ERROR_TYPE.NextJoinNotExist: err_msg = "Next join details not supplied";
                break;
            case ERROR_TYPE.TableNotExist:
                err_msg = "Table '" + this._info['TableName'] + "' does not exist";
                break;
            case ERROR_TYPE.DbNotExist:
                err_msg = "Database '" + this._info['DbName'] + "' does not exist";
                break;
            case ERROR_TYPE.NotObject:
                err_msg = "supplied value is not object";
                break;
            case ERROR_TYPE.InvalidOp:
                err_msg = "Invalid Config '" + this._info['Config'] + " '";
            case ERROR_TYPE.DbBlocked:
                err_msg = `database is blocked, cant be deleted right now`;
            default:
                err_msg = this.message;
                break;
        }
        return err_msg;
    }
}