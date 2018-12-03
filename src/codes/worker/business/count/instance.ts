import { Where } from "./where";
import { CountQuery } from "../../types";
import * as Select from '../select/index';
import { LogHelper } from "../../log_helper";
import { ERROR_TYPE, IDB_MODE } from "../../enums";
import { IdbHelper } from '../idb_helper';
import { IError } from "../../interfaces";

export class Instance extends Where {

    constructor(query: CountQuery, onSuccess: (noOfRecord: number) => void, onError: (error: IError) => void) {
        super();
        this.onError = onError;
        this.onSuccess = onSuccess;
        this.query = query;
    }

    execute() {
        try {
            if (this.query.where != null) {
                if (this.query.where.or || this.isArray(this.query.where)) {
                    const selectInstance = new Select.Instance(this.query as any,
                        (results) => {
                            this.resultCount = results.length;
                            this.onTransactionCompleted_();
                        }, this.onError);
                    selectInstance.execute();
                }
                else {
                    this.initTransaction_();
                    this.goToWhereLogic();
                }
            }
            else {
                this.initTransaction_();
                this.executeWhereUndefinedLogic();
            }
        }
        catch (ex) {
            this.onExceptionOccured(ex, { TableName: this.query.from });
        }
    }

    private initTransaction_() {
        this.createTransaction([this.query.from], this.onTransactionCompleted_, IDB_MODE.ReadOnly);
        this.objectStore = this.transaction.objectStore(this.query.from);
    }
}