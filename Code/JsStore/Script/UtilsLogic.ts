module JsStore {
    export interface IError {
        Name: string,
        Message: string
    }
    export class Utils {
        static getError(errorType: ErrorType, logError: boolean = false, errorDetail: any) {
            var Error: IError = {
                Name: errorType,
                Message: ''
            };
            switch (errorType) {
                case ErrorType.NotArray: Error.Message = "Supplied value is not an array"; break;
                case ErrorType.UndefinedColumn: Error.Message = "Column is undefined in Where"; break;
                case ErrorType.UndefinedValue: Error.Message = "Value is undefined in Where"; break;
                case ErrorType.UndefinedColumnName: Error.Message = "Column name is undefined"; break;
                case ErrorType.UndefinedColumnValue: Error.Message = "Column value is undefined"; break;
                case ErrorType.NoValueSupplied: Error.Message = "No value supplied"; break;
                case ErrorType.InvalidOp: Error.Message = "Invalid Op Value '" + errorDetail['Op'] + "'"; break;
                case ErrorType.ColumnNotExist: Error.Message = "Column '" + errorDetail['ColumnName'] + "' does not exist";
                    break;
                case ErrorType.NullValue: Error.Message = "Null value is not allowed for column '" + errorDetail['ColumnName'] + "'";
                    break;
                case ErrorType.BadDataType: Error.Message = "Supplied value for column '" + errorDetail['ColumnName'] + "' does not have valid type";
                    break;
                case ErrorType.NextJoinNotExist: Error.Message = "Next join details not supplied";
                    break;
                case ErrorType.TableNotExist: Error.Message = "Table '" + errorDetail['TableName'] + "' does not exist";
                    break;
                case ErrorType.DbNotExist: Error.Message = "Database '" + errorDetail['DbName'] + "' does not exist";
                    break;
                default: console.error('the error type is not defined');
            }
            if (logError) {
                console.error("JsStore Error :- " + Error.Message);
            }
            return Error;
        }

        static convertObjectintoLowerCase(obj: any) {
            var keys = Object.keys(obj);
            var n = keys.length;
            while (n--) {
                var key = keys[n];
                obj[key.toLowerCase()] = obj[key]
                delete obj[key]
            }
        }

        /**
         * determine and set the DataBase Type
         * 
         * 
         * @memberOf MainLogic
         */
        static setDbType = function () {
            (self as any).indexedDB = self.indexedDB || (self as any).mozIndexedDB || (self as any).webkitIndexedDB || (self as any).msIndexedDB;
            if (indexedDB) {
                (self as any).IDBTransaction = (self as any).IDBTransaction || (self as any).webkitIDBTransaction || (self as any).msIDBTransaction;
                (self as any).IDBKeyRange = (self as any).IDBKeyRange || (self as any).webkitIDBKeyRange || (self as any).msIDBKeyRange
            }
            else {
                throw 'Your browser doesnot support IndexedDb';
            }
        }
    }
}
