namespace JsStore {
    export namespace Business {
        export class Transaction extends Base {
            _results;

            constructor(onSuccess, onError) {
                super();
                this._onSuccess = onSuccess;
                this._onError = onError;
            }

            execute(tableNames: string[], txLogic) {
                var select = function (qry: ISelect, onSuccess) {
                    onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
                    var select_obj = new Select.Instance(qry, onSuccess, this._onError.bind(this));
                    select_obj._isTransaction = true;
                    select_obj.execute();
                }.bind(this);
                var insert = function (qry: IInsert, onSuccess) {
                    onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
                    var insert_obj = new Insert.Instance(qry, onSuccess, this._onError.bind(this));
                    insert_obj._isTransaction = true;
                    insert_obj.execute();
                }.bind(this);
                var update = function (qry: IUpdate, onSuccess) {
                    onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
                    var update_obj = new Update.Instance(qry, onSuccess, this._onError.bind(this));
                }.bind(this);
                var remove = function (qry: IDelete, onSuccess) {
                    onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
                    var delete_obj = new Delete.Instance(qry, onSuccess, this._onError.bind(this));
                }.bind(this);
                var count = function (qry: ICount, onSuccess) {
                    onSuccess = qry.OnSuccess ? qry.OnSuccess : onSuccess;
                    var count_obj = new Count.Instance(qry, onSuccess, this._onError.bind(this));
                }.bind(this);
                eval("var txLogic =" + txLogic);
                this.initTransaction(tableNames);
                txLogic.call(this);
            }

            private initTransaction = function (tableNames) {
                createTransaction(tableNames, this.onTransactionCompleted.bind(this));
            };

            private onTransactionCompleted = function () {
                this._onSuccess(this._results);
            };
        }
    }
}
