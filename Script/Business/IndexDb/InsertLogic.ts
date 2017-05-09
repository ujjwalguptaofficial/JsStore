module JsStorage {
    export module Business {
        export module IndexDb {
            export class InsertLogic {
                TotalRowsAffected = 0;
                Store: IDBObjectStore;
                OnSuccess: Function;
                OnError: Function;
                ErrorOccured: boolean = false;
                ErrorCount = 0;
                Error: IError;
                ValuesLength: number;

                public onSuccessRequest = function (e) {
                    ++this.TotalRowsAffected;
                    if (this.ValuesLength == this.TotalRowsAffected) {
                        if (this.OnSuccess != null) {
                            this.OnSuccess(this.TotalRowsAffected);
                        }
                    }
                }

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
                constructor(tableName: string, values, onSuccess: Function, onError: Function) {
                    try {
                        var That = this;
                        this.OnSuccess = onSuccess;
                        this.OnError = onError;
                        this.Store = DbConnection.transaction([tableName], "readwrite").objectStore(tableName);
                        this.ValuesLength = values.length;
                        values.forEach(function (value) {
                            That.checkSchemaAndModifyValue(value, tableName);
                            if (!That.ErrorOccured) {
                                var AddResult = That.Store.add(value);
                                AddResult.onerror = function (e) {
                                    That.onErrorRequest(e);
                                }
                                AddResult.onsuccess = function (e) {
                                    That.onSuccessRequest(e);
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

                private checkSchemaAndModifyValue(value, tableName: string) {
                    var CurrentTable: Table,
                        That = this;
                    Business.IndexDb.Db.Tables.every(function (table) {
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
                                That.Error = UtilityLogic.getError(ErrorType.NullValue, false, { ColumnName: column.Name });
                            }
                        }
                    });
                }


            }
        }
    }
}