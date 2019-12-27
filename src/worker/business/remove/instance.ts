import { Where } from "./where";
import { RemoveQuery, QUERY_OPTION, API, IError } from "../../../common/index";
import * as Select from '../select/index';
import { QueryHelper } from "../index";
import { getObjectFirstKey, isArray } from "../../utils/index";

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
        const queryHelper = new QueryHelper(API.Remove, this.query);
        queryHelper.checkAndModify();
        if (queryHelper.error == null) {
            try {
                this.initTransaction_();
                if (this.query.where != null) {
                    if (isArray(this.query.where)) {
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
                this.onExceptionOccured(ex);
            }
        }
        else {
            this.onError(
                queryHelper.error
            );
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
        if (this.error == null) {
            this.onSuccess(this.rowAffected);
        }
        else {
            this.onError(this.error);
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
        const key = getObjectFirstKey((this as any)._orInfo.OrQuery);
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