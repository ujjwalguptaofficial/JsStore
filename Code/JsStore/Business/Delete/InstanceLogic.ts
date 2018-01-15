namespace JsStore {
    export namespace Business {
        export namespace Delete {
            export class Instance extends Where {
                constructor(
                    query: IDelete, onSuccess: (recordDeleted: number) => void,
                    onError: (err: IError) => void
                ) {
                    super();
                    this._query = query;
                    this._onSuccess = onSuccess;
                    this._onError = onError;
                    try {
                        this.createTransaction();
                        if (query.Where) {
                            if (Array.isArray(query.Where)) {
                                this.processWhereArrayQry();
                            }
                            else {
                                this.processWhere();
                            }
                        }
                        else {
                            this.executeWhereUndefinedLogic();
                        }

                    }
                    catch (ex) {
                        this._errorOccured = true;
                        this.onExceptionOccured(ex, { TableName: query.From });
                    }
                }

                private processWhereArrayQry = function () {
                    var select_object = new Select.Instance(this._query as any,
                        function (results) {
                            var key_list = [],
                                p_key = this.getPrimaryKey(this._query.From);
                            results.forEach(function (item) {
                                key_list.push(item[p_key]);
                            });
                            results = null;
                            this._query.Where = {};
                            this._query.Where[p_key] = { In: key_list };
                            this.processWhere(false);
                        }.bind(this), this._onError);
                };

                private processWhere = function () {
                    if (this._query.Where.Or) {
                        this.processOrLogic();
                    }
                    this.goToWhereLogic();
                };

                private createTransaction = function () {
                    this._transaction = db_connection.transaction([this._query.From], "readwrite");
                    this._objectStore = this._transaction.objectStore(this._query.From);
                    this._transaction.oncomplete = this.onTransactionCompleted.bind(this);
                    this._transaction.onerror = this.onErrorOccured.bind(this);
                };

                private onTransactionCompleted = function () {
                    this._onSuccess(this._rowAffected);
                };

                private onQueryFinished = function () {
                    if (this._isOr) {
                        this.orQuerySuccess();
                    }
                };

                private orQuerySuccess = function () {
                    var key = getObjectFirstKey((this as any)._orInfo.OrQuery);
                    if (key != null) {
                        var where = {};
                        where[key] = (this as any)._orInfo.OrQuery[key];
                        delete (this as any)._orInfo.OrQuery[key];
                        this._query.Where = where;
                        this.goToWhereLogic();
                    }
                    else {
                        this._isOr = true;
                    }
                };

                private processOrLogic = function () {
                    this._isOr = true;
                    (this as any)._orInfo = {
                        OrQuery: this._query.Where.Or
                    };

                    // free or memory
                    delete this._query.Where.Or;
                };
            }
        }
    }

}