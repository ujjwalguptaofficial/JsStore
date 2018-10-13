import { Where } from "./where";
import { IUpdate, IError, ISelect } from "../../interfaces";
import * as Select from "../select/index";
import { SchemaChecker } from "./schema_checker";
import { QUERY_OPTION } from "../../enums";

export class Instance extends Where {

    constructor(query: IUpdate, onSuccess: (rowsUpdated: number) => void, onError: (err: IError) => void) {
        super();
        this.onSuccess = onSuccess;
        this.onError = onError;
        this.query = query;
        this.tableName = this.query.in;
    }

    execute() {
        try {
            this.initTransaction();
            if (this.query.where != null) {
                if (this.query.where.or || this.isArray(this.query.where)) {
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
            this.errorOccured = true;
            this.onExceptionOccured.call(this, ex, { TableName: this.query.in });
        }
    }

    private executeComplexLogic_() {
        const selectObject = new Select.Instance({
            from: this.query.in,
            where: this.query.where,
            ignoreCase: this.query.ignoreCase
        } as ISelect, (results: any[]) => {
            const key = this.getPrimaryKey(this.query.in);
            const inQuery = [];
            results.forEach((value) => {
                inQuery.push(value[key]);
            });
            results = null;
            const whereQry = { [key]: { [QUERY_OPTION.In]: inQuery } };
            this.query[QUERY_OPTION.Where] = whereQry;
            this.initTransaction();
            this.goToWhereLogic();
        }, this.onError);
        selectObject.isSubQuery = true;
        selectObject.execute();
    }
}
