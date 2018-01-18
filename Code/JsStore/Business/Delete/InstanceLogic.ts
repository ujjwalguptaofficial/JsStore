namespace JsStore {
    export namespace Business {
        export namespace Delete {
            export class Instance extends Where {
                _isOr: boolean;

                constructor(
                    query: IDelete, onSuccess: (recordDeleted: number) => void,
                    onError: (err: IError) => void
                ) {
                    super();
                    this._query = query;
                    this._onSuccess = onSuccess;
                    this._onError = onError;
                }

                execute() {
                    try {
                        this.initTransaction();
                        if (this._query.Where) {
                            if (Array.isArray(this._query.Where)) {
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
                        this.onExceptionOccured(ex, { TableName: this._query.From });
                    }
                }

                private processWhereArrayQry() {
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
                    select_object.execute();
                }

                private processWhere() {
                    if (this._query.Where.Or) {
                        this.processOrLogic();
                    }
                    this.goToWhereLogic();
                }

                private initTransaction() {
                    createTransaction([this._query.From], this.onTransactionCompleted.bind(this));
                    this._objectStore = db_transaction.objectStore(this._query.From);
                }

                private onTransactionCompleted() {
                    this._onSuccess(this._rowAffected);
                }

                private onQueryFinished() {
                    if (this._isOr === true) {
                        this.orQuerySuccess();
                    }
                    else if (this._isTransaction === true) {
                        this.onTransactionCompleted();
                    }
                }

                private orQuerySuccess() {
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
                }

                private processOrLogic() {
                    this._isOr = true;
                    (this as any)._orInfo = {
                        OrQuery: this._query.Where.Or
                    };

                    // free or memory
                    delete this._query.Where.Or;
                }
            }
        }
    }

}