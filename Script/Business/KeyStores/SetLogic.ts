module JsStorage {
    export module Business {
        export module KeyStores {
            export class SetLogic {
                Store: IDBObjectStore;
                OnSuccess: Function;
                OnError: Function;
                ErrorOccured: boolean = false;
                ErrorCount = 0;
                Error: IError;

                public onErrorRequest = function (e, customError = false) {
                    ++this.ErrorCount;
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
                    console.error(e);
                }

                constructor(tableName: string, value, isReturn, onSuccess: Function, onError: Function) {
                    try {
                        this.OnSuccess = onSuccess;
                        this.OnError = onError;
                        var That = this,
                            Updated = false;

                        var UpdateIfExist = function () {
                            var Transaction = DbConnection.transaction([tableName], "readwrite");
                            That.Store = Transaction.objectStore(tableName);
                            Transaction.oncomplete = function (e) {
                                if (Updated) {
                                    if (onSuccess != null) {
                                        onSuccess();
                                    }
                                }
                                else {
                                    SetData();
                                }
                            };
                            var CursorOpenRequest = That.Store.index('Key').openCursor(IDBKeyRange.only(value['Key']));

                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor: IDBCursorWithValue = (<any>e).target.result;
                                if (Cursor) {
                                    Updated = true;
                                    Cursor.value['Value'] = value['Value'];
                                    Cursor.update(Cursor.value);
                                }
                            }

                            CursorOpenRequest.onerror = function (e) {
                                That.ErrorOccured = true;
                                That.onErrorRequest(e);
                            }
                        }

                        var SetData = function () {
                            var Transaction = DbConnection.transaction([tableName], "readwrite");
                            That.Store = Transaction.objectStore(tableName);
                            Transaction.oncomplete = function (e) {
                                if (onSuccess != null) {
                                    onSuccess();
                                }
                            };
                            var AddResult = That.Store.add(value);
                            AddResult.onerror = function (e) {
                                That.onErrorRequest(e);
                            }
                        }

                        UpdateIfExist();
                    }
                    catch (ex) {
                        console.error(ex);
                    }
                }

            }
        }
    }
}