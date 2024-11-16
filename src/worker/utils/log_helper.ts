import { ERROR_TYPE, IError } from "@/common";

export class LogHelper implements IError {
    type: string;
    message: string;
    private info_: any;

    status: boolean;

    log(msg) {
        if (this.status) {
            console.log(msg);
        }
    }

    constructor(type: string, info?) {
        this.type = type;
        this.info_ = info;
        this.message = this.getMsg_();
    }

    throw() {
        throw this.get();
    }


    logError() {
        console.error(this.get());
    }



    get() {
        return {
            message: this.message,
            type: this.type
        } as IError;
    }

    warn() {
        console.warn(this.get());
    }

    private getMsg_() {
        let errMsg: string;
        const info = this.info_;
        const errorHandler = {
            [ERROR_TYPE.NotArray]() {
                errMsg = "Supplied value is not an array";
            },
            [ERROR_TYPE.UndefinedColumn]() {
                errMsg = "Column is undefined in Where";
            },
            [ERROR_TYPE.UndefinedValue]() {
                errMsg = "Value is undefined in Where";
            },
            [ERROR_TYPE.UndefinedColumnName]() {
                errMsg = "Column name is undefined '" + info['TableName'] + "'";
            },
            [ERROR_TYPE.UndefinedDbName]() {
                errMsg = "Database name is not supplied";
            },
            [ERROR_TYPE.UndefinedColumnValue]() {
                errMsg = "Column value is undefined";
            },
            [ERROR_TYPE.NoValueSupplied]() {
                errMsg = "No value is supplied";
            },
            [ERROR_TYPE.InvalidOp]() {
                errMsg = "Invalid Op Value '" + info['Op'] + "'";
            },
            [ERROR_TYPE.ColumnNotExist]() {
                const column = info['column'];
                errMsg = info['isOrder'] ?
                    (
                        process.env.NODE_ENV !== 'production' && info.isJoin ?
                            `Column '${column}' in order query is invalid. Please use '<table>.<column>' format for specifying a column in join query.` :
                            `Column '${column}' in order query does not exist`
                    ) :
                    `Column '${column}' does not exist`;
            },
            [ERROR_TYPE.NoIndexFound]() {
                errMsg = "No index found for column '" + info['column'] + "'. Query can not be executed without index.";
            },
            [ERROR_TYPE.NullValue]() {
                errMsg = "Null value is not allowed for column '" + info['ColumnName'] + "'";
            },
            [ERROR_TYPE.WrongDataType]() {
                errMsg = `Expected data type for the column ${info['column']} is ${info['expected']}, but received a ${info['received']}.`
                // errMsg = "Supplied value for column '" + info['column'] +
                //     "' have wrong data type";
            },
            [ERROR_TYPE.TableNotExist]() {
                errMsg = "Table '" + info['tableName'] + "' does not exist";
            },
            [ERROR_TYPE.DbNotExist]() {
                errMsg = `Database with name ${info['dbName']} does not exist`;
            },
            [ERROR_TYPE.NotObject]() {
                errMsg = "supplied value is not object";
            },
            [ERROR_TYPE.InvalidConfig]() {
                errMsg = "Invalid Config '" + info['Config'] + " '";
            },
            [ERROR_TYPE.DbBlocked]() {
                errMsg = `database is blocked, cant be deleted right now`;
            },
            [ERROR_TYPE.NullValueInWhere]() {
                errMsg = `Null/undefined is not allowed in where. Column '${info['column']}' has null`;
            },
            [ERROR_TYPE.MethodNotExist]() {
                errMsg = `method '${info}' does not exist.`;
            },
            [ERROR_TYPE.IndexedDbNotSupported]() {
                errMsg = "Browser does not support indexeddb";
            },
            getInfo() {
                errMsg = info;
            },
            [ERROR_TYPE.InvalidJoinQuery]() {
                errorHandler.getInfo();
            },
            [ERROR_TYPE.ImportScriptsFailed]() {
                errorHandler.getInfo();
            },
            [ERROR_TYPE.InvalidMiddleware]() {
                errMsg = `No function ${info} is found.`;
            },
        };
        if (process.env.NODE_ENV !== 'production') {
            Object.assign(errorHandler, {
                [ERROR_TYPE.InvalidOrderQuery]() {
                    errorHandler.getInfo();
                },
                [ERROR_TYPE.InvalidGroupQuery]() {
                    errorHandler.getInfo();
                },
                [ERROR_TYPE.NoPrimaryKey]() {
                    errMsg = `No primary key exists for the query table. The query ${JSON.stringify(info)} will not yield proper output.`
                },
            })
        }
        const errorType = this.type;
        const method = errorHandler[errorType];
        if (method) {
            method();
        }
        else {
            if (!errorType) {
                this.type = ERROR_TYPE.Unknown
            }
            errMsg = this.message;
        }
        return errMsg;
    }
}
