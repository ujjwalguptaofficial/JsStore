import { IError } from "./interfaces";
import { Error_Type } from "./enums";
import { Config } from "./config";

export class LogHelper implements IError {
    _type: Error_Type;
    _message: string;
    private _info: any;

    constructor(type: Error_Type, info: any = null) {
        this._type = type;
        this._info = info;
        this._message = this.getMsg();
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
            _message: this._message,
            _type: this._type
        } as IError;
    }

    private getMsg() {
        var err_msg: string;
        switch (this._type) {
            case Error_Type.NotArray:
                err_msg = "Supplied value is not an array";
                break;
            case Error_Type.UndefinedColumn:
                err_msg = "Column is undefined in Where";
                break;
            case Error_Type.UndefinedValue:
                err_msg = "Value is undefined in Where";
                break;
            case Error_Type.UndefinedColumnName:
                err_msg = "Column name is undefined '" + this._info['TableName'] + "'";
                break;
            case Error_Type.UndefinedDbName:
                err_msg = "Database name is not supplied";
                break;
            case Error_Type.UndefinedColumnValue:
                err_msg = "Column value is undefined";
                break;
            case Error_Type.NoValueSupplied:
                err_msg = "No value supplied";
                break;
            case Error_Type.InvalidOp:
                err_msg = "Invalid Op Value '" + this._info['Op'] + "'";
                break;
            case Error_Type.ColumnNotExist:
                err_msg = "Column '" + this._info['ColumnName'] + "' does not exist";
                break;
            case Error_Type.EnableSearchOff:
                err_msg = "Search is turned off for the Column '" + this._info['ColumnName'] + "'";
                break;
            case Error_Type.NullValue:
                err_msg = "Null value is not allowed for column '" + this._info['ColumnName'] + "'";
                break;
            case Error_Type.BadDataType:
                err_msg = "Supplied value for column '" + this._info['ColumnName'] +
                    "' does not have valid type";
                break;
            case Error_Type.NextJoinNotExist: err_msg = "Next join details not supplied";
                break;
            case Error_Type.TableNotExist:
                err_msg = "Table '" + this._info['TableName'] + "' does not exist";
                break;
            case Error_Type.DbNotExist:
                err_msg = "Database '" + this._info['DbName'] + "' does not exist";
                break;
            case Error_Type.NotObject:
                err_msg = "supplied value is not object";
                break;
            case Error_Type.InvalidOp:
                err_msg = "Invalid Config '" + this._info['Config'] + " '";
            case Error_Type.DbBlocked:
                err_msg = `database is blocked, cant be deleted right now`;
            default:
                err_msg = this._message;
                break;
        }
        return err_msg;
    }
}