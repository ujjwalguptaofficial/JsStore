import { Where } from "./where";
import { IError, API, CountQuery, IDB_MODE } from "../../../common/index";
import SelectInstance from '../select/instance';
import { QueryHelper } from "../query_helper";
import { isArray } from "../../utils/index";

export default class extends Where {

    constructor(query: CountQuery, onSuccess: (noOfRecord: number) => void, onError: (error: IError) => void) {
        super();
        this.onError = onError;
        this.onSuccess = onSuccess;
        this.query = query;
        this.tableName = query.from;
    }

    execute() {
        const queryHelper = new QueryHelper(API.Count, this.query);
        queryHelper.checkAndModify();
        if (queryHelper.error == null) {
            try {
                const getDataFromSelect = () => {
                    const selectInstance = new SelectInstance(this.query as any,
                        (results) => {
                            this.resultCount = results.length;
                            this.onTransactionCompleted_();
                        }, this.onError);
                    selectInstance.execute();
                };
                if (this.query.join == null) {
                    if (this.query.where != null) {
                        if (this.query.where.or || isArray(this.query.where)) {
                            getDataFromSelect();
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
                else {
                    getDataFromSelect();
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

    private initTransaction_() {
        this.createTransaction([this.query.from], this.onTransactionCompleted_, IDB_MODE.ReadOnly);
        this.objectStore = this.transaction.objectStore(this.query.from);
    }
}