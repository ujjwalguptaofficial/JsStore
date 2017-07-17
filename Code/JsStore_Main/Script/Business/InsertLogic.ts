module JsStore {
    export module Business {
        export class InsertLogic extends BaseLogic {
            ValuesAffected = []

            constructor(tableName: string, values, isReturn, onSuccess: Function, onError: Function) {
                super();
                try {
                    this.OnSuccess = onSuccess;
                    this.OnError = onError;
                    var That = this,
                        Transaction = DbConnection.transaction([tableName], "readwrite");
                    Transaction.oncomplete = function (e) {
                        if (onSuccess != null) {
                            onSuccess(isReturn ? That.ValuesAffected : That.RowAffected);
                        }
                    },
                        (<any>Transaction).ontimeout = function () {
                            console.log('transaction timed out');
                        }
                    var Store = Transaction.objectStore(tableName);
                    values.forEach(function (value) {
                        That.checkSchemaAndModifyValue(value, tableName);
                        if (!That.ErrorOccured) {
                            var AddResult = Store.add(value);
                            AddResult.onerror = function (e) {
                                That.onErrorOccured(e);
                            }
                            AddResult.onsuccess = function (e) {
                                if (isReturn) {
                                    That.ValuesAffected.push(value);
                                }
                                else {
                                    ++That.RowAffected;
                                }
                            }
                        }
                        else {
                            That.onErrorOccured(That.Error, true);
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
                            var CurDate = new Date();
                            value[column.Name] = {
                                DD: CurDate.getDate(),
                                MM: CurDate.getMonth() + 1,
                                YY: CurDate.getFullYear()
                            }
                        }

                        //check not null schema
                        if (column.NotNull && value[column.Name] == null) {
                            That.ErrorOccured = true;
                            That.Error = UtilityLogic.getError(ErrorType.NullValue, false, { ColumnName: column.Name });
                        }

                        //check datatype
                        if (column.DataType && typeof value[column.Name] != column.DataType) {
                            That.ErrorOccured = true;
                            That.Error = UtilityLogic.getError(ErrorType.BadDataType, false, { ColumnName: column.Name });
                        }
                    }
                });
            }


        }
    }
}
