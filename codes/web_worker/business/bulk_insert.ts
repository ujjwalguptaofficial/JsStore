import { Base } from "./base";
import { IInsert, IError } from "../interfaces";
import { Error_Type } from "../enums";
import { LogHelper } from "../log_helper";
import { IdbHelper } from './idb_helper';

export class BulkInsert extends Base {
    _query: IInsert;

    constructor(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
        super();
        this._query = query;
        this._onSuccess = onSuccess;
        this._onError = onError;
    }

    execute() {
        if (!Array.isArray(this._query.values)) {
            this.onErrorOccured(
                new LogHelper(Error_Type.NotArray).get(),
                true
            );
        }
        else if (this.isTableExist(this._query.into) === true) {
            try {
                this.bulkinsertData();
            }
            catch (ex) {
                this.onExceptionOccured(ex, { TableName: this._query.into });
            }
        }
        else {
            var error = new LogHelper(Error_Type.TableNotExist, { TableName: this._query.into });
            error.throw();
        }
    }

    private bulkinsertData() {
        IdbHelper.createTransaction([this._query.into], () => {
            this._onSuccess();
        });
        this._objectStore = IdbHelper._transaction.objectStore(this._query.into);
        this._query.values.forEach(function (value) {
            this._objectStore.add(value);
        }, this);
    }
}
