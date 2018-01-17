namespace JsStore {
    export namespace Business {
        export namespace Update {
            export class Instance extends Where {
                constructor(query: IUpdate, onSuccess: () => void, onError: (err: IError) => void) {
                    super();
                    this._onSuccess = onSuccess;
                    this._onError = onError;
                    this._query = query;
                }

                execute() {
                    try {
                        this._error = new SchemaChecker(this.getTable(this._query.In)).
                            check(this._query.Set, this._query.In);
                        if (!this._error) {
                            if (this._query.Where) {
                                if (this._query.Where.Or || Array.isArray(this._query.Where)) {
                                    this.executeComplexLogic();
                                }
                                else {
                                    this.initTransaction();
                                    this.goToWhereLogic();
                                }
                            }
                            else {
                                this.initTransaction();
                                this.executeWhereUndefinedLogic();
                            }
                        }
                        else {
                            this._errorOccured = true;
                            this.onErrorOccured(this._error, true);
                        }
                    }
                    catch (ex) {
                        this._errorOccured = true;
                        this.onExceptionOccured.call(this, ex, { TableName: this._query.In });
                    }
                }

                private onTransactionCompleted() {
                    this._onSuccess(this._rowAffected);
                }

                private initTransaction() {
                    createTransaction([this._query.In], this.onTransactionCompleted.bind(this));
                    this._objectStore = db_transaction.objectStore(this._query.In);
                }

                private executeComplexLogic() {
                    var select_object = new Select.Instance({
                        From: this._query.In,
                        Where: this._query.Where
                    } as ISelect, function (results: any[]) {
                        var key = this.getPrimaryKey(this._query.In),
                            in_query = [],
                            where_qry = {};
                        results.forEach(function (value) {
                            in_query.push(value[key]);
                        });
                        results = null;
                        where_qry[key] = { In: in_query };
                        this._query['Where'] = where_qry;
                        this.initTransaction();
                        this.goToWhereLogic();
                    }.bind(this), this._onError.bind(this));
                    select_object.execute();
                }
            }
        }
    }
}
