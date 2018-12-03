import { Where } from "./where";
import { RemoveQuery } from "../../types";
import * as Select from '../select/index';
import { QUERY_OPTION } from "../../enums";
import { IError } from "../../interfaces";

export class Instance extends Where {


    constructor(
        query: RemoveQuery, onSuccess: (recordRemoved: number) => void,
        onError: (err: IError) => void
    ) {
        super();
        this.query = query;
        this.onSuccess = onSuccess;
        this.onError = onError;
    }

    execute() {
        try {
            this.initTransaction_();
            if (this.query.where != null) {
                if (this.isArray(this.query.where)) {
                    this.processWhereArrayQry();
                }
                else {
                    this.processWhere_();
                }
            }
            else {
                this.executeWhereUndefinedLogic();
            }

        }
        catch (ex) {
            this.errorOccured = true;
            this.onExceptionOccured(ex, { TableName: this.query.from });
        }
    }

    private processWhereArrayQry() {
        const selectObject = new Select.Instance(this.query, (results) => {
            const keyList = [];
            const pkey = this.getPrimaryKey(this.query.from);
            results.forEach((item) => {
                keyList.push(item[pkey]);
            });
            results = null;
            const whereQry = { [pkey]: { [QUERY_OPTION.In]: keyList } };
            this.query.ignoreCase = null;
            this.query[QUERY_OPTION.Where] = whereQry;
            this.processWhere_();
        }, this.onError);
        selectObject.isSubQuery = true;
        selectObject.execute();
    }

    private processWhere_() {
        if (this.query.where.or) {
            this.processOrLogic();
        }
        this.goToWhereLogic();
    }

    private initTransaction_() {
        this.createTransaction([this.query.from], this.onTransactionCompleted_);
        this.objectStore = this.transaction.objectStore(this.query.from);
    }

    private onTransactionCompleted_ = () => {
        if (this.errorOccured === false) {
            this.onSuccess(this.rowAffected);
        }
    }

    protected onQueryFinished() {
        if (this.isOr === true) {
            this.orQuerySuccess_();
        }
        else if (this.isTransaction === true) {
            this.onTransactionCompleted_();
        }
    }

    private orQuerySuccess_() {
        const key = this.getObjectFirstKey((this as any)._orInfo.OrQuery);
        if (key != null) {
            const where = {};
            where[key] = (this as any)._orInfo.OrQuery[key];
            delete (this as any)._orInfo.OrQuery[key];
            this.query.where = where;
            this.goToWhereLogic();
        }
        else {
            this.isOr = true;
        }
    }

    private processOrLogic() {
        this.isOr = true;
        (this as any)._orInfo = {
            OrQuery: this.query.where.or
        };

        // free or memory
        delete this.query.where.or;
    }
}