namespace JsStore {
    export class Utils {
        static getError(errorType: ErrorType, errorDetail: any) {
            var error: IError = {
                Name: errorType,
                Message: ''
            };
            switch (errorType) {
                case ErrorType.NotArray: error.Message = "Supplied value is not an array"; break;
                case ErrorType.UndefinedColumn: error.Message = "Column is undefined in Where"; break;
                case ErrorType.UndefinedValue: error.Message = "Value is undefined in Where"; break;
                case ErrorType.UndefinedColumnName: error.Message = "Column name is undefined"; break;
                case ErrorType.UndefinedColumnValue: error.Message = "Column value is undefined"; break;
                case ErrorType.NoValueSupplied: error.Message = "No value supplied"; break;
                case ErrorType.InvalidOp: error.Message = "Invalid Op Value '" + errorDetail['Op'] + "'"; break;
                case ErrorType.ColumnNotExist:
                    error.Message = "Column '" + errorDetail['ColumnName'] + "' does not exist";
                    break;
                case ErrorType.NullValue:
                    error.Message = "Null value is not allowed for column '" + errorDetail['ColumnName'] + "'";
                    break;
                case ErrorType.BadDataType:
                    error.Message = "Supplied value for column '" + errorDetail['ColumnName'] +
                        "' does not have valid type";
                    break;
                case ErrorType.NextJoinNotExist: error.Message = "Next join details not supplied";
                    break;
                case ErrorType.TableNotExist: error.Message = "Table '" + errorDetail['TableName'] + "' does not exist";
                    break;
                case ErrorType.DbNotExist: error.Message = "Database '" + errorDetail['DbName'] + "' does not exist";
                    break;
                default: console.error('the error type is not defined');
            }
            return error;
        }

        static convertObjectintoLowerCase(obj: any) {
            var keys = Object.keys(obj);
            var n = keys.length;
            while (n--) {
                var key = keys[n];
                obj[key.toLowerCase()] = obj[key];
                delete obj[key];
            }
        }

        /**
         * determine and set the DataBase Type
         * 
         * 
         * @memberOf MainLogic
         */
        static setDbType = function () {
            (self as any).indexedDB = self.indexedDB || (self as any).mozIndexedDB ||
                (self as any).webkitIndexedDB || (self as any).msIndexedDB;
            if (indexedDB) {
                (self as any).IDBTransaction = (self as any).IDBTransaction || (self as any).webkitIDBTransaction ||
                    (self as any).msIDBTransaction;
                (self as any).IDBKeyRange = (self as any).IDBKeyRange || (self as any).webkitIDBKeyRange ||
                    (self as any).msIDBKeyRange;
            }
            else {
                throwError('Your browser doesnot support IndexedDb');
            }
        };
    }
}
