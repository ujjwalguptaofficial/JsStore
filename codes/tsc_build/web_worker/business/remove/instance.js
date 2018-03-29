var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Where } from "./where";
import { IdbHelper } from "../idb_helper";
import { Util } from "../../util";
import * as Select from '../select/index';
var Instance = /** @class */ (function (_super) {
    __extends(Instance, _super);
    function Instance(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this._query = query;
        _this._onSuccess = onSuccess;
        _this._onError = onError;
        return _this;
    }
    Instance.prototype.execute = function () {
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
    };
    Instance.prototype.processWhereArrayQry = function () {
        var select_object = new Select.Instance(this._query, function (results) {
            var key_list = [], p_key = this.getPrimaryKey(this._query.from);
            results.forEach(function (item) {
                key_list.push(item[p_key]);
            });
            results = null;
            this._query.where = {};
            this._query.where[p_key] = { In: key_list };
            this.processWhere(false);
        }.bind(this), this._onError);
        select_object.execute();
    };
    Instance.prototype.processWhere = function () {
        if (this._query.where.or) {
            this.processOrLogic();
        }
        this.goToWhereLogic();
    };
    Instance.prototype.initTransaction = function () {
        IdbHelper.createTransaction([this._query.from], this.onTransactionCompleted.bind(this));
        this._objectStore = IdbHelper._transaction.objectStore(this._query.from);
    };
    Instance.prototype.onTransactionCompleted = function () {
        if (this._errorOccured === false) {
            this._onSuccess(this._rowAffected);
        }
    };
    Instance.prototype.onQueryFinished = function () {
        if (this._isOr === true) {
            this.orQuerySuccess();
        }
        else if (this._isTransaction === true) {
            this.onTransactionCompleted();
        }
    };
    Instance.prototype.orQuerySuccess = function () {
        var key = Util.getObjectFirstKey(this._orInfo.OrQuery);
        if (key != null) {
            var where = {};
            where[key] = this._orInfo.OrQuery[key];
            delete this._orInfo.OrQuery[key];
            this._query.where = where;
            this.goToWhereLogic();
        }
        else {
            this._isOr = true;
        }
    };
    Instance.prototype.processOrLogic = function () {
        this._isOr = true;
        this._orInfo = {
            OrQuery: this._query.where.Or
        };
        // free or memory
        delete this._query.where.Or;
    };
    return Instance;
}(Where));
export { Instance };
//# sourceMappingURL=instance.js.map