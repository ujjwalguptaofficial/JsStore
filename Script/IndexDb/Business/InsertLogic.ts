module JsStore {
    export module IndexDb {
        export module Business {
            export class InsertLogic {
                RowsAffected = 0;
                ValuesAffected: Array<any> = [];
                Store: IDBObjectStore;
                OnSuccess: Function;
                OnError: Function;
                ErrorOccured: boolean = false;
                ErrorCount = 0;
                Error: IError;

                public onErrorRequest = function (e, customError = false) {
                    if (this.ErrorCount == 1) {
                        if (this.OnError != null) {
                            if (!customError) {
                                this.OnError((e as any).target.error, this.TotalRowsAffected);
                            }
                            else {
                                this.OnError(e, this.TotalRowsAffected);
                            }
                        }
                    }
                }

                constructor(tableName: string, values, isReturn, onSuccess: Function, onError: Function) {
                    try {
                        this.OnSuccess = onSuccess;
                        this.OnError = onError;
                        var That = this,
                            Transaction = DbConnection.transaction([tableName], "readwrite");
                        Transaction.oncomplete = function (e) {
                            if (onSuccess != null) {
                                onSuccess(isReturn ? That.ValuesAffected : That.RowsAffected);
                            }
                        },
                            (<any>Transaction).ontimeout = function () {
                                console.log('transaction timed out');
                            }
                        this.Store = Transaction.objectStore(tableName);
                        values.forEach(function (value) {
                            That.checkSchemaAndModifyValue(value, tableName);
                            if (!That.ErrorOccured) {
                                var AddResult = That.Store.add(value);
                                AddResult.onerror = function (e) {
                                    That.onErrorRequest(e);
                                }
                                AddResult.onsuccess = function (e) {
                                    if (isReturn) {
                                        That.ValuesAffected.push(value);
                                    }
                                    else {
                                        ++That.RowsAffected;
                                    }
                                }
                            }
                            else {
                                That.onErrorRequest(That.Error, true);
                            }
                        });
                    }
                    catch (ex) {
                        console.error(ex);
                    }
                }


                /**
                 * check the defined schema and based upon that modify or create the value
                 * 
                 * @private
                 * @param {any} value 
                 * @param {string} tableName 
                 * 
                 * @memberof InsertLogic
                 */
                private checkSchemaAndModifyValue(value, tableName: string) {
                    var CurrentTable: Table,
                        That = this;
                    ActiveDataBase.Tables.every(function (table) {
                        if (table.Name == tableName) {
                            CurrentTable = table;
                            return false;
                        }
                        return true;
                    });
                    CurrentTable.Columns.forEach(function (column) {
                        if (!That.ErrorOccured) {
                            //check auto increment scheme
                            if (column.AutoIncrement) {
                                var ColumnValue: number = Number(localStorage.getItem(tableName + "_" + column.Name + "value:"));
                                value[column.Name] = ++ColumnValue;
                                localStorage.setItem(tableName + "_" + column.Name + "value:", ColumnValue.toString());
                            }
                            else if (column.CurrentDate) { //check CurrentDate Schema
                                value[column.Name] = new Date();
                            }

                            //check not null schema
                            if (column.NotNull && value[column.Name] == null) {
                                That.ErrorOccured = true;
                                ++That.ErrorCount;
                                That.Error = UtilityLogic.getError(ErrorType.NullValue, false, { ColumnName: column.Name });
                            }

                            //check datatype
                            if (column.DataType && typeof value[column.Name] != column.DataType) {
                                That.ErrorOccured = true;
                                ++That.ErrorCount;
                                That.Error = UtilityLogic.getError(ErrorType.BadDataType, false, { ColumnName: column.Name });
                            }
                        }
                    });
                }


            }
        }
    }
}