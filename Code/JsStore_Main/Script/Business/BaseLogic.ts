module JsStore {
    export module Business {
        export class BaseLogic {
            Error: IError;
            ErrorOccured: boolean = false;
            ErrorCount = 0;
            RowAffected = 0;
            OnSuccess: Function;
            OnError: Function;
            Transaction: IDBTransaction;
            ObjectStore: IDBObjectStore;

            protected onErrorOccured = function (e, customError = false) {
                ++this.ErrorCount;
                if (this.ErrorCount == 1) {
                    if (this.OnError != null) {
                        if (!customError) {
                            this.OnError((e as any).target.error);
                        }
                        else {
                            this.OnError(e);
                        }
                    }
                }
            }

            protected isNull = function (value) {
                return value == null || value.length == 0;
            }

            protected onExceptionOccured = function (ex: DOMException, info) {
                if (ex.name == "NotFoundError") {
                    UtilityLogic.getError(ErrorType.TableNotExist, true, info);
                }
                else {
                    console.error(ex);
                }
            }

            /**
            * For matching the different column value existance
            * 
            * @private
            * @param {any} where 
            * @param {any} value 
            * @returns 
            * 
            * @memberOf SelectLogic
            */
            protected checkForWhereConditionMatch(where, value) {
                for (var Column in where) {
                    if (Array.isArray(where[Column])) {
                        var Status = true;
                        for (var i = 0, length = where[Column].length; i < length; i++) {
                            if (where[Column][i] == value[Column]) {
                                Status = true;
                                break;
                            }
                            else {
                                Status = false;
                            }
                        };
                        if (!Status) {
                            return Status;
                        }
                    }
                    else {
                        if (where[Column] != value[Column]) {
                            return false;
                        }
                    }
                }
                return true;
            }

            private checkWhereSchema(suppliedValue, tableName: string) {
                var CurrentTable: Table,
                    That = this;
                //get current table
                ActiveDataBase.Tables.every(function (table) {
                    if (table.Name == tableName) {
                        CurrentTable = table;
                        return false;
                    }
                    return true;
                });

                //loop through table column and find data is valid
                CurrentTable.Columns.forEach(function (column: Column) {
                    if (!That.ErrorOccured) {
                        if (column.Name in suppliedValue) {
                            var Value = suppliedValue[column.Name],
                                executeCheck = function (value) {
                                    //check not null schema
                                    if (column.NotNull && That.isNull(value)) {
                                        That.ErrorOccured = true;
                                        That.Error = UtilityLogic.getError(ErrorType.NullValue, false, { ColumnName: column.Name });
                                    }

                                    //check datatype
                                    if (column.DataType && typeof value != column.DataType) {
                                        That.ErrorOccured = true;
                                        That.Error = UtilityLogic.getError(ErrorType.BadDataType, false, { ColumnName: column.Name });
                                    }
                                };

                            if (Array.isArray(Value)) {
                                Value.forEach(function (item) {
                                    executeCheck(item);
                                })
                            }
                            else {
                                executeCheck(Value);
                            }
                        }

                    }
                });
            }
        }
    }

}
