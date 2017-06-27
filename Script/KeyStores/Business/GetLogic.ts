module JsStore {
    export module KeyStores {
        export module Business {
            export class GetLogic extends BaseGetLogic {
                Query: ISelect;

                private executeWhereLogic = function () {
                    var Column,
                        That: GetLogic = this


                    var executeInnerWhereLogic = function (column, value) {
                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorRequest(e);
                        }

                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor: IDBCursorWithValue = (<any>e).target.result;
                            if (Cursor) {
                                That.Results = Cursor.value['Value'];
                            }
                        }
                    }

                    for (Column in this.Query.Where) {
                        executeInnerWhereLogic(Column, this.Query.Where[Column]);
                        break;
                    }

                }

                constructor(query: ISelect, onSuccess: Function, onError: Function) {
                    super();
                    var That = this;
                    this.Query = query;
                    this.OnSuccess = onSuccess;
                    this.OnError = onError;

                    this.Transaction = DbConnection.transaction([query.From], "readonly");
                    this.Transaction.oncomplete = function (e) {
                        if (onSuccess != null) {
                            onSuccess(That.Results);
                        }
                    }

                    this.ObjectStore = this.Transaction.objectStore(query.From);
                    this.executeWhereLogic();

                }

            }
        }

    }
}