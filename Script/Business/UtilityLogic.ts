module JsStorage {
    export module Business {
        export interface IError {
            Name: string,
            Value: string
        }
        export class UtilityLogic {
            static getError(errorType: ErrorType, logError: boolean = false, errorDetail: any) {
                var Error: IError = {
                    Name: ErrorType[errorType],
                    Value: ''
                };
                switch (errorType) {
                    case ErrorType.NotArray: Error.Value = "Supplied value is not an array"; break;
                    case ErrorType.UndefinedColumn: Error.Value = "Column is undefined in Where"; break;
                    case ErrorType.UndefinedValue: Error.Value = "Value is undefined in Where"; break;
                    case ErrorType.UndefinedColumnName: Error.Value = "column name is undefined"; break;
                    case ErrorType.UndefinedColumnValue: Error.Value = "column value is undefined"; break;
                    case ErrorType.NoValueSupplied: Error.Value = "no value supplied"; break;
                    case ErrorType.InvalidOp: Error.Value = "Invalid Op Value : " + errorDetail['Op']; break;
                    case ErrorType.ColumnNotExist: Error.Value = "column :" + errorDetail['ColumnName'] + " does not exist";
                        break;
                    case ErrorType.NullValue: Error.Value = "Null value is not allowed for column: " + errorDetail['ColumnName'];
                        break;
                    case ErrorType.BadDataType: Error.Value = "Supplied value for column: " + errorDetail['ColumnName'] + " is not valid";
                        break;
                    default: console.warn('the error type is not defined');
                }
                if (logError) {
                    console.warn("JsStorage Error : - " + Error.Value);
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


        }
    }
}