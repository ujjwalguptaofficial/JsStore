module JsStorage {
    export module Business {
        export module IndexDb {
            export class SelectLogic {
                constructor(query: ISelect, onSuccess: Function, onError: Function) {
                    var That = this,
                        ErrorOccured: boolean = false,
                        ErrorCount = 0,
                        Results = [],
                        Transaction: IDBTransaction = DbConnection.transaction([query.From], "readonly"),
                        ObjectStore: IDBObjectStore = Transaction.objectStore(query.From),
                        onSuceessRequest = function () {
                            if (onSuccess != null) {
                                onSuccess(Results);
                            }
                        },

                        onErrorRequest = function (e) {
                            if (ErrorCount == 1) {
                                if (onError != null) {
                                    onError((e as any).target.error);
                                }
                            }
                        };
                    if (query.Where == undefined) {
                        var CursorOpenRequest = ObjectStore.openCursor();

                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = (<any>e).target.result;
                            if (Cursor) {
                                Results.push(Cursor.value);
                                (Cursor as any).continue();
                            }
                            else {
                                if (onSuccess != null) {
                                    onSuceessRequest();
                                }
                            }

                        }
                        CursorOpenRequest.onerror = onErrorRequest;
                    }
                    else {
                        var Column,
                            ExecutionNo = 0,
                            ConditionLength = Object.keys(query.Where).length,
                            Results = [],
                            OnSuccessGetRequest = function () {
                                ++ExecutionNo;
                                if (ExecutionNo == ConditionLength) {
                                    onSuceessRequest();
                                }
                            };
                        for (Column in query.Where) {
                            if (!ErrorOccured) {
                                if (ObjectStore.keyPath != null && ObjectStore.keyPath == Column) {//(That.isPrimaryKey(query.From, condition)) {
                                    var GetRequest = ObjectStore.get(query.Where[Column]);
                                    GetRequest.onerror = function (e) {
                                        ErrorOccured = true; ++ErrorCount;
                                        onErrorRequest(e);
                                    }
                                    GetRequest.onsuccess = OnSuccessGetRequest;

                                }
                                else if (ObjectStore.indexNames.contains(Column)) {
                                    var CursorOpenRequest = ObjectStore.index(Column).openCursor(IDBKeyRange.only(query.Where[Column]));
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                        if (Cursor) {
                                            Results.push(Cursor);
                                            Cursor.continue();
                                        }
                                        else {
                                            OnSuccessGetRequest();
                                        }
                                    }
                                    CursorOpenRequest.onerror = function (e) {
                                        ErrorOccured = true; ++ErrorCount;
                                        onErrorRequest(e);
                                    }
                                }
                                else {
                                    UtilityLogic.getError(ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                }
                            }

                        }



                    }

                }

                private getPrimaryKey(tablename: string) {
                    var PrimaryKeyColumn = "";
                    ActiveDataBase.Tables.every(function (table) {
                        if (table.Name == tablename) {
                            table.Columns.every(function (column) {
                                if (column.PrimaryKey) {
                                    PrimaryKeyColumn = column.Name;
                                    return true;
                                }
                                return false;
                            })
                        }
                        return false;
                    })
                    return PrimaryKeyColumn;
                }

                private isWhereValid(condition: ICondition) {
                    if (condition.Column == undefined) {
                        return ErrorType.UndefinedColumn;
                    }
                    else if (condition.Value == undefined) {
                        return ErrorType.UndefinedValue;
                    }
                    return null;

                }

                private IsWhereValid(tablename: string, isprimaryKey: boolean, condition: any) {

                    if (condition.Column == undefined) {
                        return ErrorType.UndefinedColumn;
                    }
                    else if (condition.Value == undefined) {
                        return ErrorType.UndefinedValue;
                    }
                    return null;

                }
            }
        }

    }
}