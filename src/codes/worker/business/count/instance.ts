import { Where } from "./where";
import { ICount, IError } from "../../interfaces";
import * as Select from '../select/index';
import { LogHelper } from "../../log_helper";
import { Error_Type } from "../../enums";
import { IdbHelper } from '../idb_helper';

export class Instance extends Where {

    constructor(query: ICount, onSuccess: (noOfRecord: number) => void, onError: (error: IError) => void) {
        super();
        this._onError = onError;
        this._onSuccess = onSuccess;
        this._query = query;
    }

    execute() {
        if (this.isTableExist(this._query.from)) {
            try {
                if (this._query.where !== undefined) {
                    this.addGreatAndLessToNotOp();
                    if (this._query.where.Or || Array.isArray(this._query.where)) {
                        var select_object = new Select.Instance(this._query as any,
                            (results) => {
                                this._resultCount = results.length;
                                this.onTransactionCompleted();
                            }, this._onError);
                        select_object.execute();
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
            catch (ex) {
                this.onExceptionOccured(ex, { TableName: this._query.from });
            }
        }
        else {
            this._errorOccured = true;
            this.onErrorOccured(
                new LogHelper(Error_Type.TableNotExist, { TableName: this._query.From }),
                true
            );
        }
    }

    private initTransaction() {
        IdbHelper.createTransaction([this._query.From], this.onTransactionCompleted.bind(this), 'readonly');
        this._objectStore = IdbHelper._transaction.objectStore(this._query.From);
    }

    private onQueryFinished() {
        if (this._isTransaction === true) {
            this.onTransactionCompleted();
        }
    }

    private onTransactionCompleted() {
        if (this._errorOccured === false) {
            this._onSuccess(this._resultCount);
        }
    }
}