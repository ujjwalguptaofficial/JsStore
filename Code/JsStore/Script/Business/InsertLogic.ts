module JsStore {
    export module Business {
        export class Insert extends Base {
            ValuesAffected = [];
            Query: IInsert;
            ValuesIndex = 0;
            Table: Model.ITable;
            public onTransactionCompleted = function () {
                if (this.OnSuccess != null) {
                    this.OnSuccess(this.IsReturn ? this.ValuesAffected : this.RowAffected);
                }
            }

            private insertData = function (value) {
                if (value) {
                    var That = this;
                    That.checkSchemaAndModifyValue(value, function () {
                        if (!That.ErrorOccured) {
                            var Transaction = DbConnection.transaction([That.Query.Into], "readwrite"),
                                ObjectStore = Transaction.objectStore(That.Query.Into);
                            var AddResult = ObjectStore.add(value);
                            AddResult.onerror = function (e) {
                                That.onErrorOccured(e);
                            }
                            AddResult.onsuccess = function (e) {
                                That.ValuesAffected.push(value);
                                ++That.RowAffected;
                                That.insertData(That.Query.Values[That.ValuesIndex++]);
                            }
                        }
                        else {
                            That.onErrorOccured(That.Error, true);
                        }
                    });

                }
                else {
                    this.onTransactionCompleted();
                }
            }

            constructor(query: IInsert, onSuccess: Function, onError: Function) {
                super();
                try {
                    this.Query = query;
                    this.OnSuccess = onSuccess;
                    this.OnError = onError;
                    var That = this;
                    this.Table = this.getTable(query.Into);
                    this.insertData(this.Query.Values[this.ValuesIndex++]);
                }
                catch (ex) {
                    this.onExceptionOccured(ex, { TableName: query.Into });
                }
            }

            private getTable = function (tableName: string) {
                var CurrentTable: Table,
                    That = this;
                ActiveDataBase.Tables.every(function (table) {
                    if (table.Name == tableName) {
                        CurrentTable = table;
                        return false;
                    }
                    return true;
                });
                return CurrentTable;
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
            private checkSchemaAndModifyValue(value, callBack: Function) {
                var That = this,
                    TableName = this.Table.Name,
                    Index = 0,
                    checkAndModifyInternal = function (column) {
                        if (column) {
                            var CheckNotNullAndDataType = function () {
                                //check not null schema
                                if (column.NotNull && value[column.Name] == null) {
                                    That.ErrorOccured = true;
                                    That.Error = Utils.getError(ErrorType.NullValue, false, { ColumnName: column.Name });
                                }

                                //check datatype
                                if (column.DataType && typeof value[column.Name] != column.DataType) {
                                    That.ErrorOccured = true;
                                    That.Error = Utils.getError(ErrorType.BadDataType, false, { ColumnName: column.Name });
                                }
                                checkAndModifyInternal(That.Table.Columns[Index++]);
                            };
                            if (!That.ErrorOccured) {
                                //check auto increment scheme
                                if (column.AutoIncrement) {
                                    KeyStore.get("JsStore_" + ActiveDataBase.Name + "_" + TableName + "_" + column.Name + "_Value", function (columnValue: number) {
                                        value[column.Name] = ++columnValue;
                                        KeyStore.set("JsStore_" + ActiveDataBase.Name + "_" + TableName + "_" + column.Name + "_Value", columnValue);
                                        CheckNotNullAndDataType();
                                    });
                                }
                                else if (column.Default && value[column.Name] == null) { //check Default Schema
                                    value[column.Name] = column.Default;
                                    CheckNotNullAndDataType();
                                }
                                else {
                                    CheckNotNullAndDataType();
                                }
                            }
                            else {
                                callBack();
                            }
                        }
                        else {
                            callBack();
                        }
                    }
                checkAndModifyInternal(That.Table.Columns[Index++]);
            }


        }
    }
}
