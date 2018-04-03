import { Where } from "./where";
import { IRemove, IError } from "../../interfaces";
import { IdbHelper } from "../idb_helper";
import { Util } from "../../util";
import * as Select from '../select/index';
import { QueryOption } from "../../inner_enums";

export class Instance extends Where {
    _isOr: boolean;

    constructor(
        query: IRemove, onSuccess: (recordRemoved: number) => void,
        onError: (err: IError) => void
    ) {
        super();
        this._query = query;
        this._onSuccess = onSuccess;
        this._onError = onError;
    }

    execute() {
        try {
            if (this._query.where !== undefined) {
                this.addGreatAndLessToNotOp();
                this.initTransaction();
                if (Array.isArray(this._query.where)) {
                    this.processWhereArrayQry();
                }
                else {
                    this.processWhere();
                }
            }
            else {
                this.initTransaction();
                this.executeWhereUndefinedLogic();
            }

        }
        catch (ex) {
            this._errorOccured = true;
            this.onExceptionOccured(ex, { TableName: this._query.from });
        }
    }

    private processWhereArrayQry() {
        var select_object = new Select.Instance(this._query as any,
            function (results) {
                var key_list = [],
                    p_key = this.getPrimaryKey(this._query.from);
                results.forEach((item) => {
                    key_list.push(item[p_key]);
                });
                results = null;
                this._query.where = {};
                this._query.where[p_key] = {};
                this._query.where[p_key][QueryOption.In] = key_list;
                this.processWhere(false);
            }.bind(this), this._onError);
        select_object.execute();
    }

    private processWhere() {
        if (this._query.where.or) {
            this.processOrLogic();
        }
        this.goToWhereLogic();
    }

    private initTransaction() {
        IdbHelper.createTransaction([this._query.from], this.onTransactionCompleted.bind(this));
        this._objectStore = IdbHelper._transaction.objectStore(this._query.from);
    }

    private onTransactionCompleted() {
        if (this._errorOccured === false) {
            this._onSuccess(this._rowAffected);
        }
    }

    protected onQueryFinished() {
        if (this._isOr === true) {
            this.orQuerySuccess();
        }
        else if (this._isTransaction === true) {
            this.onTransactionCompleted();
        }
    }

    private orQuerySuccess() {
        var key = Util.getObjectFirstKey((this as any)._orInfo.OrQuery);
        if (key != null) {
            var where = {};
            where[key] = (this as any)._orInfo.OrQuery[key];
            delete (this as any)._orInfo.OrQuery[key];
            this._query.where = where;
            this.goToWhereLogic();
        }
        else {
            this._isOr = true;
        }
    }

    private processOrLogic() {
        this._isOr = true;
        (this as any)._orInfo = {
            OrQuery: this._query.where.Or
        };

        // free or memory
        delete this._query.where.Or;
    }
}