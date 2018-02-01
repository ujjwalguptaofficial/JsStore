namespace JsStore {
    export enum Error_Type {
        UndefinedColumn = "undefined_column",
        UndefinedValue = "undefined_value",
        UndefinedColumnName = "undefined_column_name",
        UndefinedDbName = "undefined_database_name",
        UndefinedColumnValue = "undefined_column_value",
        NotArray = "not_array",
        NoValueSupplied = "no_value_supplied",
        ColumnNotExist = "column_not_exist",
        InvalidOp = "invalid_operator",
        NullValue = "null_value",
        BadDataType = "bad_data_type",
        NextJoinNotExist = "next_join_not_exist",
        TableNotExist = "table_not_exist",
        DbNotExist = "db_not_exist",
        IndexedDbUndefined = "indexeddb_undefined",
        IndexedDbBlocked = "indexeddb_blocked",
        ConnectionAborted = "connection_aborted",
        ConnectionClosed = "connection_closed",
        NotObject = "not_object",
        InvalidConfig = "invalid_config"
    }

    export interface IError {
        _type: Error_Type;
        _message: string;
    }

    export class Error implements IError {
        _type: Error_Type;
        _message: string;
        private _info: any;

        constructor(type: Error_Type, info: any = null) {
            this._type = type;
            this._info = info;
            this._message = this.getMsg();
        }

        public throw = function () {
            throw this.get();
        };

        logError = function () {
            console.error(this.get());
        };

        logWarning = function () {
            console.warn(this.get());
        };

        public get() {
            return {
                _message: this._message,
                _type: this._type
            } as IError;
        }

        private getMsg = function () {
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
                default:
                    err_msg = this._message;
                    break;
            }
            return err_msg;
        };
    }
}