import { Where } from "./where";
import { IUpdate, IError, ISelect } from "../../interfaces";
import * as Select from "../select/index";
import { SchemaChecker } from "./schema_checker";
import { QUERY_OPTION } from "../../enums";

export class Instance extends Where {
    query: IUpdate;
    constructor(query: IUpdate, onSuccess: () => void, onError: (err: IError) => void) {
        super();
        this.onSuccess = onSuccess;
        this.onError = onError;
        this.query = query;
    }

    execute() {
        try {
            this.error = new SchemaChecker(this.getTable(this.query.in)).
                check(this.query.set, this.query.in);
            if (!this.error) {
                if (this.query.where !== undefined) {
                    this.addGreatAndLessToNotOp();
                    if (this.query.where.or || Array.isArray(this.query.where)) {
                        this.executeComplexLogic();
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
            else {
                this.errorOccured = true;
                this.onErrorOccured(this.error, true);
            }
        }
        catch (ex) {
            this.errorOccured = true;
            this.onExceptionOccured.call(this, ex, { TableName: this.query.in });
        }
    }

    private executeComplexLogic() {
        var select_object = new Select.Instance({
            from: this.query.in,
            where: this.query.where
        } as ISelect, (results: any[]) => {
            var key = this.getPrimaryKey(this.query.in),
                in_query = [],
                where_qry = {};
            results.forEach((value) => {
                in_query.push(value[key]);
            });
            results = null;
            where_qry[key] = { [QUERY_OPTION.In]: in_query };
            this.query[QUERY_OPTION.Where] = where_qry;
            this.initTransaction();
            this.goToWhereLogic();
        }, this.onError.bind(this));
        select_object.execute();
    }
}
