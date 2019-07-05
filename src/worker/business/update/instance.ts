import { Where } from "./where";
import { UpdateQuery, SelectQuery } from "../../types";
import * as Select from "../select/index";
import { QUERY_OPTION, API } from "../../enums";
import { IError } from "../../interfaces";
import { QueryHelper } from "../query_helper";
import { isArray } from "../../utils/index";

export class Instance extends Where {

    constructor(query: UpdateQuery, onSuccess: (rowsUpdated: number) => void, onError: (err: IError) => void) {
        super();
        this.onSuccess = onSuccess;
        this.onError = onError;
        this.query = query;
        this.tableName = this.query.in;
    }

    execute() {
        const queryHelper = new QueryHelper(API.Update, this.query);
        queryHelper.checkAndModify();
        if (queryHelper.error == null) {
            try {
                this.initTransaction();
                if (this.query.where != null) {
                    if (this.query.where.or || isArray(this.query.where)) {
                        this.executeComplexLogic_();
                    }
                    else {
                        this.goToWhereLogic();
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

    private executeComplexLogic_() {
        const selectObject = new Select.Instance({
            from: this.query.in,
            where: this.query.where,
            ignoreCase: this.query.ignoreCase
        } as SelectQuery, (results: any[]) => {
            const key = this.getPrimaryKey(this.query.in);
            const inQuery = [];
            results.forEach((value) => {
                inQuery.push(value[key]);
            });
            results = null;
            const whereQry = { [key]: { [QUERY_OPTION.In]: inQuery } };
            this.query.ignoreCase = null;
            this.query[QUERY_OPTION.Where] = whereQry;
            this.initTransaction();
            this.goToWhereLogic();
        }, this.onError);
        selectObject.isSubQuery = true;
        selectObject.execute();
    }
}
