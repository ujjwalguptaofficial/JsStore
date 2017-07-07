module JsStore {
    export module Business {
        export class UpdateLogic {
            Query: IUpdate;
            Error: IError;
            ErrorOccured: boolean = false;
            ErrorCount = 0;
            RowAffected = 0;
            OnSuccess: Function;
            OnError: Function;
            Transaction: IDBTransaction;
            ObjectStore: IDBObjectStore;

            private onErrorRequest = function (e, customError = false) {
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
                    That.onErrorRequest(e);
                }

            }

            private executeWhereLogic() {
                var That = this;
                for (var TmpColumn in this.Query.Where) {
                    if (!this.ErrorOccured) {
                        if (this.ObjectStore.indexNames.contains(TmpColumn)) {
                            var CursorOpenRequest = That.ObjectStore.index(TmpColumn).openCursor(IDBKeyRange.only(That.Query.Where[TmpColumn]));
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                if (Cursor) {
                                    for (var key in That.Query.Set) {
                                        Cursor.value[key] = That.Query.Set[key];
                                    }
                                    Cursor.update(Cursor.value);
                                    ++That.RowAffected;
                                    Cursor.continue();
                                }

                            }
                            CursorOpenRequest.onerror = function (e) {
                                That.ErrorOccured = true;
                                That.onErrorRequest(e);
                            }
                        }
                        else {
                            That.Error = UtilityLogic.getError(ErrorType.ColumnNotExist, true, { ColumnName: Column });
                            That.onErrorRequest(That.Error, true);
                        }

                    }
                    else {
                        return;
                    }
                }
            }

            constructor(query: IUpdate, onSuccess: Function, onError: Function) {
                try {
                    this.Query = query;
                    this.OnSuccess = onSuccess;
                    this.OnError = onError;
                    this.Transaction = DbConnection.transaction([query.In], "readwrite");
                    this.ObjectStore = this.Transaction.objectStore(query.In);
                    var That = this;


                    this.Transaction.oncomplete = function (e) {
                        if (onSuccess != null) {
                            onSuccess(That.RowAffected);
                        }
                    },
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
                catch (ex) {
                    if (ex.name == "NotFoundError") {
                        UtilityLogic.getError(ErrorType.TableNotExist, true, { TableName: query.In });
                    }
                    else {
                        console.error(ex);
                    }
                }
            }

            private checkSchema(value, tableName: string) {
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

                //
                CurrentTable.Columns.forEach(function (column) {
                    if (!That.ErrorOccured) {
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
