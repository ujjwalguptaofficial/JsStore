module KeyStore {
    export module Business {
        export class Set extends Base {

            private setData = function (value) {
                var That: Set = this,
                    updateIfExistElseInsert = function () {
                        var CursorOpenRequest = That.ObjectStore.index('Key').openCursor(IDBKeyRange.only(value['Key']));
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor: IDBCursorWithValue = (<any>e).target.result;
                            if (Cursor) {
                                Cursor.value['Value'] = value['Value'];
                                Cursor.update(Cursor.value);
                            }
                            else {
                                insertData();
                            }
                        }

                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        }

                    },
                    insertData = function () {
                        var AddResult = That.ObjectStore.add(value);
                        AddResult.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        }
                    }
                updateIfExistElseInsert();
            }

            constructor(query: IInsert, onSuccess: Function, onError: Function) {
                super();
                try {
                    var That = this;
                    this.OnError = onError;
                    this.Transaction = DbConnection.transaction([query.TableName], "readwrite");
                    this.ObjectStore = this.Transaction.objectStore(query.TableName);
                    this.Transaction.oncomplete = function (e) {
                        if (onSuccess != null) {
                            onSuccess();
                        }
                    };
                    this.setData(query.Set);
                }
                catch (ex) {
                    console.error(ex);
                }
            }

        }
    }
}
