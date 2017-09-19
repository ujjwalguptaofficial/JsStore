module JsStore {
    export module Business {
        export module Count {
            export class Where extends Like {
                private executeRequest = function (column, value, op) {
                    var That = this;
                    value = op ? value[op] : value;
                    if (!That.CheckFlag && this.ObjectStore.count) {
                        var CountRequest = this.ObjectStore.index(column).count(this.getKeyRange(value, op));
                        CountRequest.onsuccess = function () {
                            That.ResultCount = CountRequest.result;
                        }
                        CountRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        }
                    }
                    else {
                        var CursorOpenRequest = this.ObjectStore.index(column).openCursor(this.getKeyRange(value, op));
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor: IDBCursorWithValue = (<any>e).target.result;
                            if (Cursor) {
                                if (That.checkForWhereConditionMatch(Cursor.value)) {
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
                }

                protected executeWhereLogic = function () {
                    for (var Column in this.Query.Where) {
                        if (!this.ErrorOccured) {
                            if (this.ObjectStore.indexNames.contains(Column)) {
                                var Value = this.Query.Where[Column];
                                if (typeof Value == 'object') {
                                    this.CheckFlag = Boolean(Object.keys(Value).length || Object.keys(this.Query.Where).length);
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
                                else {
                                    this.CheckFlag = Boolean(Object.keys(this.Query.Where).length);
                                    this.executeRequest(Column, Value);
                                }
                            }
                            else {
                                this.ErrorOccured = true;
                                this.Error = Utils.getError(ErrorType.ColumnNotExist, { ColumnName: Column });
                                throwError(this.Error);
                            }
                        }
                        break;
                    }
                }

            }
        }

    }
}
