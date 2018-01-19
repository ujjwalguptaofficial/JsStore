namespace JsStore {
    export namespace Business {
        export class Transaction extends Base {
            _results;

            constructor(onSuccess, onError) {
                super();
                this._onSuccess = onSuccess;
                this._onError = onError;
            }

            execute(tableNames: string[], data, txLogic) {
                var request_queue: IWebWorkerRequest[] = [],
                    onRequestFinished = function (result) {
                        var finisehd_request = request_queue.shift();
                        if (finisehd_request && !this._errorOccured) {
                            if (finisehd_request.OnSuccess) {
                                finisehd_request.OnSuccess(result);
                            }
                            if (request_queue.length >= 1) {
                                executeRequest(request_queue[0]);
                            }
                        }
                    }.bind(this),
                    executeRequest = function (request: IWebWorkerRequest) {
                        var request_obj;
                        switch (request.Name) {
                            case 'select':
                                request_obj = new Select.Instance(
                                    request.Query, onRequestFinished, this._onError.bind(this)
                                );
                                break;
                            case 'insert':
                                request_obj = new Insert.Instance(
                                    request.Query, onRequestFinished, this._onError.bind(this)
                                );
                                break;
                            case 'update': break;
                            case 'remove': break;
                            case 'count': break;
                        }
                        request_obj._isTransaction = true;
                        request_obj.execute();
                    }.bind(this),
                    pushRequest = function (request: IWebWorkerRequest) {
                        request_queue.push(request);
                        if (request_queue.length === 1) {
                            this.initTransaction(tableNames);
                            executeRequest(request_queue[0]);
                        }
                    }.bind(this),
                    select = function (qry: ISelect, onSuccess) {
                        onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
                        pushRequest({
                            Name: 'select',
                            Query: qry,
                            OnSuccess: onSuccess
                        } as IWebWorkerRequest);
                    };
                var insert = function (qry: IInsert, onSuccess) {
                    onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
                    pushRequest({
                        Name: 'insert',
                        Query: qry,
                        OnSuccess: onSuccess
                    } as IWebWorkerRequest);
                };
                var update = function (qry: IUpdate, onSuccess) {
                    onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
                    pushRequest({
                        Name: 'update',
                        Query: qry,
                        OnSuccess: onSuccess
                    } as IWebWorkerRequest);
                };
                var remove = function (qry: IRemove, onSuccess) {
                    onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
                    pushRequest({
                        Name: 'remove',
                        Query: qry,
                        OnSuccess: onSuccess
                    } as IWebWorkerRequest);
                };
                var count = function (qry: ICount, onSuccess) {
                    onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
                    pushRequest({
                        Name: 'count',
                        Query: qry,
                        OnSuccess: onSuccess
                    } as IWebWorkerRequest);
                };
                eval("var txLogic =" + txLogic);
                txLogic.call(this, data);
                data = null;
            }

            private initTransaction(tableNames) {
                createTransaction(tableNames, this.onTransactionCompleted.bind(this));
            }

            private onTransactionCompleted() {
                this._onSuccess(this._results);
            }
        }
    }
}
