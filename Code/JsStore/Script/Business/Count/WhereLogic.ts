module JsStore {
    export module Business {
        export module Count {
            export class Where extends Like {
                private executeRequest = function (column, value, op) {
                    var That = this,
                        CursorOpenRequest;
                    value = op ? value[op] : value;
                    CursorOpenRequest = this.ObjectStore.index(column).openCursor(this.getKeyRange(value, op));

                    CursorOpenRequest.onsuccess = function (e) {
                        var Cursor: IDBCursorWithValue = (<any>e).target.result;
                        if (Cursor) {
                            if (!That.CheckFlag) {
                                ++That.ResultCount;
                            }
                            else if (That.checkForWhereConditionMatch(Cursor.value)) {
                                ++That.ResultCount;
                            }
                            Cursor.continue();
                        }
                    }

                    CursorOpenRequest.onerror = function (e) {
                        That.ErrorOccured = true;
                        That.onErrorOccured(e);
                    }
                }

                protected executeWhereLogic = function () {
                    for (var Column in this.Query.Where) {
                        if (!this.ErrorOccured) {
                            if (this.ObjectStore.indexNames.contains(Column)) {
                                var Value = this.Query.Where[Column];
                                if (typeof Value == 'string') {
                                    this.executeRequest(Column, Value);
                                }
                                else {
                                    this.CheckFlag = Object.keys(Value).length > 1 || Object.keys(this.Query.Where).length > 1 ? true : false;
                                    if (Value.Like) {
                                        var FilterValue = Value.Like.split('%');
                                        if (FilterValue[1]) {
                                            if (FilterValue.length > 2) {
                                                this.executeLikeLogic(Column, FilterValue[1], Occurence.Any);
                                            }
                                            else {
                                                this.executeLikeLogic(Column, FilterValue[1], Occurence.Last);
                                            }
                                        }
                                        else {
                                            this.executeLikeLogic(Column, FilterValue[0], Occurence.First);
                                        }
                                    }
                                    else if (Value['In']) {
                                        for (var i = 0; i < Value['In'].length; i++) {
                                            this.executeRequest(Column, Value['In'][i])
                                        }
                                    }
                                    else if (Value['-']) {
                                        this.executeRequest(Column, Value, '-');
                                    }
                                    else if (Value['>']) {
                                        this.executeRequest(Column, Value, '>');
                                    }
                                    else if (Value['<']) {
                                        this.executeRequest(Column, Value, '<');
                                    }
                                    else if (Value['>=']) {
                                        this.executeRequest(Column, Value, '>=');
                                    }
                                    else if (Value['<=']) {
                                        this.executeRequest(Column, Value, '<=');
                                    }
                                    else {
                                        this.executeRequest(Column, Value);
                                    }
                                }
                            }
                            else {
                                this.ErrorOccured = true;
                                this.Error = Utils.getError(ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                this.onErrorOccured(this.Error, true);
                            }
                        }
                        break;
                    }
                }

            }
        }

    }
}
