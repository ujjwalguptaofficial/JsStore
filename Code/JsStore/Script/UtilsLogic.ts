module JsStore {
    export interface IError {
        Name: string,
        Value: string
    }
    export class Utils {
        static getError(errorType: ErrorType, logError: boolean = false, errorDetail: any) {
            var Error: IError = {
                Name: ErrorType[errorType],
                Value: ''
            };
            switch (errorType) {
                case ErrorType.NotArray: Error.Value = "Supplied value is not an array"; break;
                case ErrorType.UndefinedColumn: Error.Value = "Column is undefined in Where"; break;
                case ErrorType.UndefinedValue: Error.Value = "Value is undefined in Where"; break;
                case ErrorType.UndefinedColumnName: Error.Value = "Column name is undefined"; break;
                case ErrorType.UndefinedColumnValue: Error.Value = "Column value is undefined"; break;
                case ErrorType.NoValueSupplied: Error.Value = "No value supplied"; break;
                case ErrorType.InvalidOp: Error.Value = "Invalid Op Value '" + errorDetail['Op'] + "'"; break;
                case ErrorType.ColumnNotExist: Error.Value = "Column '" + errorDetail['ColumnName'] + "' does not exist";
                    break;
                case ErrorType.NullValue: Error.Value = "Null value is not allowed for column '" + errorDetail['ColumnName'] + "'";
                    break;
                case ErrorType.BadDataType: Error.Value = "Supplied value for column '" + errorDetail['ColumnName'] + "' does not have valid type";
                    break;
                case ErrorType.NextJoinNotExist: Error.Value = "Next join details not supplied";
                    break;
                case ErrorType.TableNotExist: Error.Value = "Table '" + errorDetail['TableName'] + "' does not exist";;
                    break;
                default: console.error('the error type is not defined');
            }
            if (logError) {
                console.error("JsStorage Error :- " + Error.Value);
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
