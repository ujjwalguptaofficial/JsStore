import { IError } from "./interfaces";
import { ERROR_TYPE } from "./enums";
import { Config } from "./config";

export class LogHelper implements IError {
    type: ERROR_TYPE;
    message: string;
    private info_: any;

    constructor(type: ERROR_TYPE, info: any = null) {
        this.type = type;
        this.info_ = info;
        this.message = this.getMsg_();
    }

    throw() {
        throw this.get();
    }

    static log(msg) {
        if (Config.isLogEnabled) {
            console.log(msg);
        }
    }

    logError() {
        console.error(this.get());
    }

    // logWarning() {
    //     console.warn(this.get());
    // }

    get() {
        return {
            message: this.message,
            type: this.type
        } as IError;
    }

    private getMsg_() {
        let errMsg: string;
        switch (this.type) {
            case ERROR_TYPE.NotArray:
                errMsg = "Supplied value is not an array";
                break;
            case ERROR_TYPE.UndefinedColumn:
                errMsg = "Column is undefined in Where";
                break;
            case ERROR_TYPE.UndefinedValue:
                errMsg = "Value is undefined in Where";
                break;
            case ERROR_TYPE.UndefinedColumnName:
                errMsg = "Column name is undefined '" + this.info_['TableName'] + "'";
                break;
            case ERROR_TYPE.UndefinedDbName:
                errMsg = "Database name is not supplied";
                break;
            case ERROR_TYPE.UndefinedColumnValue:
                errMsg = "Column value is undefined";
                break;
            case ERROR_TYPE.NoValueSupplied:
                errMsg = "No value is supplied";
                break;
            case ERROR_TYPE.InvalidOp:
                errMsg = "Invalid Op Value '" + this.info_['Op'] + "'";
                break;
            case ERROR_TYPE.ColumnNotExist:
                errMsg = this.info_['isOrder'] ?
                    `Column '${this.info_['ColumnName']}' in order query does not exist` :
                    `Column '${this.info_['ColumnName']}' does not exist`;
                break;
            case ERROR_TYPE.EnableSearchOff:
                errMsg = "Search is turned off for the Column '" + this.info_['ColumnName'] + "'";
                break;
            case ERROR_TYPE.NullValue:
                errMsg = "Null value is not allowed for column '" + this.info_['ColumnName'] + "'";
                break;
            case ERROR_TYPE.WrongDataType:
                errMsg = "Supplied value for column '" + this.info_['ColumnName'] +
                    "' have wrong data type";
                break;
            case ERROR_TYPE.NextJoinNotExist: errMsg = "Next join details not supplied";
                break;
            case ERROR_TYPE.TableNotExist:
                errMsg = "Table '" + this.info_['tableName'] + "' does not exist";
                break;
            case ERROR_TYPE.DbNotExist:
                errMsg = "Database '" + this.info_['DbName'] + "' does not exist";
                break;
            case ERROR_TYPE.NotObject:
                errMsg = "supplied value is not object";
                break;
            case ERROR_TYPE.InvalidOp:
                errMsg = "Invalid Config '" + this.info_['Config'] + " '";
                break;
            case ERROR_TYPE.DbBlocked:
                errMsg = `database is blocked, cant be deleted right now`;
                break;
            case ERROR_TYPE.InvalidColumn:
                errMsg = `Invalid column name ${this.info_['column']}`;
                break;
            case ERROR_TYPE.NullValueInWhere:
                errMsg = `Null/undefined is not allowed in where. Column '${this.info_['column']}' has null`;
                break;
            default:
                errMsg = this.message;
                break;
        }
        return errMsg;
    }
}