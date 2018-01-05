namespace JsStore {
    export namespace Business {
        export namespace Select {
            export class Instance extends Helper {
                constructor(query: ISelect, onSuccess: (results: any[]) => void, onError: (err: IError) => void) {
                    super();
                    this._query = query;
                    this._onSuccess = onSuccess;
                    this._onError = onError;
                    this._skipRecord = this._query.Skip;
                    this._limitRecord = this._query.Limit;
                    try {
                        if (query.Where) {
                            if (Array.isArray(query.Where)) {
                                this.processWhereArrayQry();
                            }
                            else {
                                this.processWhere(false);
                            }
                        }
                        else {
                            this.createTransaction();
                            this.executeWhereUndefinedLogic();
                        }
                    }
                    catch (ex) {
                        this._errorOccured = true;
                        this.onExceptionOccured.call(this, ex, { TableName: query.From });
                    }
                }

                private processWhereArrayQry = function () {
                    var original_onsuccess = this._onSuccess,
                        where_query = this._query.Where,
                        output = [], operation,
                        pKey = this.getPrimaryKey(this._query.From),
                        isItemExist = function (keyValue) {
                            var is_exist = false;
                            output.every(function (item) {
                                if (item[pKey] === keyValue) {
                                    is_exist = true;
                                    return false;
                                }
                                return true;
                            });
                            return is_exist;
                        },
                        createTransaction = function () {
                            try {
                                this._transaction = db_connection.transaction(
                                    [this._query.From],
                                    "readonly"
                                );
                                this._transaction.oncomplete = onSuccess;
                                this._transaction.ontimeout = this.onTransactionTimeout.bind(this);
                                this._objectStore = this._transaction.objectStore(this._query.From);
                            }
                            catch (ex) {
                                this._errorOccured = true;
                                this.onExceptionOccured.call(this, ex, { TableName: this._query.From });
                            }
                        }.bind(this),
                        onSuccess = function () {
                            if (operation === 'and') {
                                if (output.length > 0) {
                                    var and_results = [];
                                    this._results.forEach(function (item) {
                                        if (isItemExist(item[pKey])) {
                                            and_results.push(item);
                                        }
                                    });
                                    output = and_results;
                                    and_results = null;
                                }
                                else {
                                    output = this._results;
                                }
                            }
                            else {
                                if (output.length > 0) {
                                    this._results = output.concat(this._results);
                                    this.removeDuplicates();
                                    output = this._results;
                                }
                                else {
                                    output = this._results;
                                }
                            }
                            this._results = [];
                            if (where_query.length > 0) {
                                processFirstQry();
                            }
                            else {
                                original_onsuccess(output);
                            }
                        }.bind(this),
                        processFirstQry = function () {
                            this._query.Where = where_query.shift();
                            if (this._query.Where['Or']) {
                                if (Object.keys(this._query.Where).length === 1) {
                                    operation = 'or';
                                    this._query.Where = this._query.Where['Or'];
                                    createTransaction();
                                }
                                else {
                                    operation = 'and';
                                    this._onSuccess = onSuccess;
                                }
                            }
                            else {
                                operation = 'and';
                                createTransaction();
                            }
                            this.processWhere(true);
                        }.bind(this);
                    processFirstQry();
                };

                private createTransaction = function () {
                    this._transaction = db_connection.transaction([this._query.From], "readonly");
                    this._transaction.oncomplete = this.onTransactionCompleted.bind(this);
                    (this._transaction as any).ontimeout = this.onTransactionTimeout.bind(this);
                    this._objectStore = this._transaction.objectStore(this._query.From);
                };

                private processWhere = function (isTransactionCreated) {
                    if (this._query.Where.Or) {
                        this.processOrLogic();
                        this.createTransactionForOrLogic();
                    }
                    else if (!isTransactionCreated) {
                        this.createTransaction();
                    }
                    this.goToWhereLogic();
                };

                private onTransactionCompleted = function () {
                    if (this._sendResultFlag) {
                        this.processOrderBy();
                        if (this._query.Distinct) {
                            var group_by = [];
                            var result = this._results[0];
                            for (var key in result) {
                                group_by.push(key);
                            }
                            var primary_key = this.getPrimaryKey(this._query.From),
                                index = group_by.indexOf(primary_key);
                            group_by.splice(index, 1);
                            this._query.GroupBy = group_by.length > 0 ? group_by : null;
                        }
                        if (this._query.GroupBy) {
                            if (this._query.Aggregate) {
                                this.executeAggregateGroupBy();
                            }
                            else {
                                this.processGroupBy();
                            }
                        }
                        else if (this._query.Aggregate) {
                            this.processAggregateQry();
                        }
                        this._onSuccess(this._results);
                    }
                };

                private createTransactionForOrLogic = function (query) {
                    try {
                        this._transaction = db_connection.transaction([this._query.From], "readonly");
                        this._transaction.oncomplete = this.orQuerySuccess.bind(this);
                        this._transaction.ontimeout = this.onTransactionTimeout.bind(this);
                        this._objectStore = this._transaction.objectStore(this._query.From);
                    }
                    catch (ex) {
                        this._errorOccured = true;
                        this.onExceptionOccured.call(this, ex, { TableName: this._query.From });
                    }
                };

                private orQueryFinish = function () {
                    this._results = (this as any)._orInfo.Results;
                    // free or info memory
                    (this as any)._orInfo.Results = undefined;
                    this.removeDuplicates();
                    (this as any)._orInfo.OnSucess(this._results);
                };

                private orQuerySuccess = function () {
                    (this as any)._orInfo.Results = (this as any)._orInfo.Results.concat(this._results);
                    if (!this._query.Limit || (this._query.Limit > (this as any)._orInfo.Results.length)) {
                        this._results = [];
                        var key = getObjectFirstKey((this as any)._orInfo.OrQuery);
                        if (key != null) {
                            var where = {};
                            where[key] = (this as any)._orInfo.OrQuery[key];
                            delete (this as any)._orInfo.OrQuery[key];
                            this._query.Where = where;
                            this.createTransactionForOrLogic();
                            this.goToWhereLogic();
                        }
                        else {
                            this.orQueryFinish();
                        }
                    }
                    else {
                        this.orQueryFinish();
                    }
                };

                private processOrLogic = function () {
                    (this as any)._orInfo = {
                        OrQuery: this._query.Where.Or,
                        OnSucess: this._onSuccess,
                        Results: []
                    };
                    // free or memory
                    delete this._query.Where.Or;
                };
            }
        }
    }
}
