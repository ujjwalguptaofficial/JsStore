import { Base } from "./base";
import { IInsert, IError } from "../interfaces";
import { ERROR_TYPE } from "../enums";
import { LogHelper } from "../log_helper";
import { IdbHelper } from './idb_helper';

export class BulkInsert extends Base {
    query: IInsert;

    constructor(query: IInsert, onSuccess: () => void, onError: (err: IError) => void) {
        super();
        this.query = query;
        this.onSuccess = onSuccess;
        this.onError = onError;
    }

    execute() {
        if (!Array.isArray(this.query.values)) {
            this.onErrorOccured(
                new LogHelper(ERROR_TYPE.NotArray),
                true
            );
        }
        else if (this.isTableExist(this.query.into) === true) {
            try {
                this.bulkinsertData();
            }
            catch (ex) {
                this.onExceptionOccured(ex, { TableName: this.query.into });
            }
        }
        else {
            var error = new LogHelper(ERROR_TYPE.TableNotExist, { TableName: this.query.into });
            error.throw();
        }
    }

    private bulkinsertData() {
        IdbHelper.createTransaction([this.query.into], () => {
            this.onSuccess();
        });
        this.objectStore = IdbHelper.transaction.objectStore(this.query.into);
        this.query.values.forEach(function (value) {
            this._objectStore.add(value);
        }, this);
    }
}
