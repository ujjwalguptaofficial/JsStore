namespace JsStore {
    export enum Error_Type {
        UndefinedColumn = "undefined_column",
        UndefinedValue = "undefined_value",
        UndefinedColumnName = "undefined_column_name",
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
        ConnectionClosed = "connection_closed"
    }

    export interface IError {
        _type: Error_Type;
        _message: string;
    }

    export class Error implements IError {
        _type: Error_Type;
        _message: string;
        _info: any;

        constructor(type: Error_Type, info: any = null) {
            this._type = type;
            this._info = info;
        }

        public throw = function () {
            throw this.get();
        };

        print = function (isWarn: boolean = false) {
            var error_obj = this.get();
            if (isWarn) {
                console.warn(error_obj);
            }
            else {
                console.error(error_obj);
            }
        };

        private get = function () {
            var error_obj = {
                _type: this._type,
            } as IError;

            switch (this._type) {
                case Error_Type.NotArray:
                    error_obj._message = "Supplied value is not an array";
                    break;
                case Error_Type.UndefinedColumn:
                    error_obj._message = "Column is undefined in Where";
                    break;
                case Error_Type.UndefinedValue:
                    error_obj._message = "Value is undefined in Where";
                    break;
                case Error_Type.UndefinedColumnName:
                    error_obj._message = "Column name is undefined";
                    break;
                case Error_Type.UndefinedColumnValue:
                    error_obj._message = "Column value is undefined";
                    break;
                case Error_Type.NoValueSupplied:
                    error_obj._message = "No value supplied";
                    break;
                case Error_Type.InvalidOp:
                    error_obj._message = "Invalid Op Value '" + this._info['Op'] + "'";
                    break;
                case Error_Type.ColumnNotExist:
                    error_obj._message = "Column '" + this._info['ColumnName'] + "' does not exist";
                    break;
                case Error_Type.NullValue:
                    error_obj._message = "Null value is not allowed for column '" + this._info['ColumnName'] + "'";
                    break;
                case Error_Type.BadDataType:
                    error_obj._message = "Supplied value for column '" + this._info['ColumnName'] +
                        "' does not have valid type";
                    break;
                case Error_Type.NextJoinNotExist: error_obj._message = "Next join details not supplied";
                    break;
                case Error_Type.TableNotExist:
                    error_obj._message = "Table '" + this._info['TableName'] + "' does not exist";
                    break;
                case Error_Type.DbNotExist:
                    error_obj._message = "Database '" + this._info['DbName'] + "' does not exist";
                    break;
                default:
                    error_obj._message = this._message;
                    break;
            }
            return error_obj;
        };
    }
}