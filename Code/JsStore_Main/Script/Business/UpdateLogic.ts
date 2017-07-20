module JsStore {
    export module Business {
        export class UpdateLogic extends BaseLogic {
            Query: IUpdate;

            private executeWhereUndefinedlogic() {
                var That = this,
                    CursorOpenRequest = this.ObjectStore.openCursor();
                CursorOpenRequest.onsuccess = function (e) {
                    var Cursor: IDBCursorWithValue = (<any>e).target.result;
                    if (Cursor) {
                        for (var key in That.Query.Set) {
                            Cursor.value[key] = That.Query.Set[key];
                        }
                        Cursor.update(Cursor.value);
                        ++That.RowAffected;
                        (Cursor as any).continue();
                    }

                }
                CursorOpenRequest.onerror = function (e) {
                    That.onErrorOccured(e);
                }

            }

            private executeWhereLogic() {
                var That = this,
                    executeInnerUpdateLogic = function (column, value) {
                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor: IDBCursorWithValue = (<any>e).target.result;
                            if (Cursor) {
                                if (That.checkForWhereConditionMatch(That.Query.Where, Cursor.value)) {
                                    for (var key in That.Query.Set) {
                                        Cursor.value[key] = That.Query.Set[key];
                                    }
                                    Cursor.update(Cursor.value);
                                    ++That.RowAffected;
                                }
                                Cursor.continue();
                            }

                        }
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        }

                    };
                for (var Column in this.Query.Where) {
                    if (!this.ErrorOccured) {
                        if (this.ObjectStore.indexNames.contains(Column)) {
                            if (Array.isArray(this.Query.Where[Column])) {
                                for (var i = 0; i < this.Query.Where[Column].length; i++) {
                                    executeInnerUpdateLogic(Column, this.Query.Where[Column][i])
                                }
                            }
                            else {
                                executeInnerUpdateLogic(Column, this.Query.Where[Column]);
                            }
                        }
                        else {
                            That.ErrorOccured = true;
                            That.Error = UtilityLogic.getError(ErrorType.ColumnNotExist, true, { ColumnName: Column });
                            That.onErrorOccured(That.Error, true);
                        }
                        break;
                    }
                    else {
                        return;
                    }
                }
            }

            constructor(query: IUpdate, onSuccess: Function, onError: Function) {
                try {
                    super();
                    this.OnError = onError;
                    this.checkSchema(query.Set, query.In);
                    if (!this.ErrorOccured) {
                        this.Query = query;
                        this.OnSuccess = onSuccess;
                        this.Transaction = DbConnection.transaction([query.In], "readwrite");
                        this.ObjectStore = this.Transaction.objectStore(query.In);
                        var That = this;
                        this.Transaction.oncomplete = function (e) {
                            if (onSuccess != null) {
                                onSuccess(That.RowAffected);
                            }
                        };
                        (<any>this.Transaction).ontimeout = function () {
                            console.log('transaction timed out');
                        }
                        if (query.Where == undefined) {
                            this.executeWhereUndefinedlogic();
                        }
                        else {
                            this.executeWhereLogic();
                        }
                    }
                    else {
                        this.onErrorOccured(this.Error, true);
                    }
                }
                catch (ex) {
                    this.onExceptionOccured(ex, { TableName: query.In });
                }
            }

            private checkSchema(suppliedValue, tableName: string) {
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
                            var executeCheck = function (value) {
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
                            executeCheck(suppliedValue[column.Name]);
                        }

                    }
                });
            }
        }
    }

}
