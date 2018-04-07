import { Where } from "./where";
import { IRemove, IError } from "../../interfaces";
import { IdbHelper } from "../idb_helper";
import * as Select from '../select/index';
import { QUERY_OPTION } from "../../enums";

export class Instance extends Where {
    _isOr: boolean;

    constructor(
        query: IRemove, onSuccess: (recordRemoved: number) => void,
        onError: (err: IError) => void
    ) {
        super();
        this.query = query;
        this.onSuccess = onSuccess;
        this.onError = onError;
    }

    execute() {
        try {
            if (this.query.where !== undefined) {
                this.addGreatAndLessToNotOp();
                this.initTransaction_();
                if (Array.isArray(this.query.where)) {
                    this.processWhereArrayQry();
                }
                else {
                    this.processWhere_();
                }
            }
            else {
                this.initTransaction_();
                this.executeWhereUndefinedLogic();
            }

        }
        catch (ex) {
            this.errorOccured = true;
            this.onExceptionOccured(ex, { TableName: this.query.from });
        }
    }

    private processWhereArrayQry() {
        const selectObject = new Select.Instance(this.query,
            function (results) {
                const keyList = [];
                const pkey = this.getPrimaryKey(this._query.from);
                results.forEach((item) => {
                    keyList.push(item[pkey]);
                });
                results = null;
                this._query.where = {};
                this._query.where[pkey] = {};
                this._query.where[pkey][QUERY_OPTION.In] = keyList;
                this.processWhere(false);
            }.bind(this), this.onError);
        selectObject.execute();
    }

    private processWhere_() {
        if (this.query.where.or) {
            this.processOrLogic();
        }
        this.goToWhereLogic();
    }

    private initTransaction_() {
        IdbHelper.createTransaction([this.query.from], this.onTransactionCompleted_);
        this.objectStore = IdbHelper.transaction.objectStore(this.query.from);
    }

    private onTransactionCompleted_() {
        if (this.errorOccured === false) {
            this.onSuccess(this.rowAffected);
        }
    }

    protected onQueryFinished() {
        if (this._isOr === true) {
            this.orQuerySuccess();
        }
        else if (this.isTransaction === true) {
            this.onTransactionCompleted_();
        }
    }

    private orQuerySuccess() {
        let key = this.getObjectFirstKey((this as any)._orInfo.OrQuery);
        if (key != null) {
            let where = {};
            where[key] = (this as any)._orInfo.OrQuery[key];
            delete (this as any)._orInfo.OrQuery[key];
            this.query.where = where;
            this.goToWhereLogic();
        }
        else {
            this._isOr = true;
        }
    }

    private processOrLogic() {
        this._isOr = true;
        (this as any)._orInfo = {
            OrQuery: this.query.where.Or
        };

        // free or memory
        delete this.query.where.Or;
    }
}