import { Where } from "./where";
import { IUpdate, IError, ISelect } from "../../interfaces";
import * as Select from "../select/index";
import { SchemaChecker } from "./schema_checker";

export class Instance extends Where {
    constructor(query: IUpdate, onSuccess: () => void, onError: (err: IError) => void) {
        super();
        this._onSuccess = onSuccess;
        this._onError = onError;
        this._query = query;
    }

    execute() {
        try {
            this._error = new SchemaChecker(this.getTable(this._query.In)).
                check(this._query.Set, this._query.In);
            if (!this._error) {
                if (this._query.Where !== undefined) {
                    this.addGreatAndLessToNotOp();
                    if (this._query.Where.Or || Array.isArray(this._query.Where)) {
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
                this._errorOccured = true;
                this.onErrorOccured(this._error, true);
            }
        }
        catch (ex) {
            this._errorOccured = true;
            this.onExceptionOccured.call(this, ex, { TableName: this._query.In });
        }
    }

    private executeComplexLogic() {
        var select_object = new Select.Instance({
            from: this._query.in,
            where: this._query.where
        } as ISelect, (results: any[]) => {
            var key = this.getPrimaryKey(this._query.In),
                in_query = [],
                where_qry = {};
            results.forEach((value) => {
                in_query.push(value[key]);
            });
            results = null;
            where_qry[key] = { In: in_query };
            this._query['Where'] = where_qry;
            this.initTransaction();
            this.goToWhereLogic();
        }, this._onError.bind(this));
        select_object.execute();
    }
}
