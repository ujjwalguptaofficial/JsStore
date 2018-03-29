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
import * as Select from "../select/index";
import { SchemaChecker } from "./schema_checker";
var Instance = /** @class */ (function (_super) {
    __extends(Instance, _super);
    function Instance(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this._onSuccess = onSuccess;
        _this._onError = onError;
        _this._query = query;
        return _this;
    }
    Instance.prototype.execute = function () {
        try {
            this._error = new SchemaChecker(this.getTable(this._query.in)).
                check(this._query.set, this._query.in);
            if (!this._error) {
                if (this._query.where !== undefined) {
                    this.addGreatAndLessToNotOp();
                    if (this._query.where.or || Array.isArray(this._query.where)) {
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
            this.onExceptionOccured.call(this, ex, { TableName: this._query.in });
        }
    };
    Instance.prototype.executeComplexLogic = function () {
        var _this = this;
        var select_object = new Select.Instance({
            from: this._query.in,
            where: this._query.where
        }, function (results) {
            var key = _this.getPrimaryKey(_this._query.in), in_query = [], where_qry = {};
            results.forEach(function (value) {
                in_query.push(value[key]);
            });
            results = null;
            where_qry[key] = { In: in_query };
            _this._query['where'] = where_qry;
            _this.initTransaction();
            _this.goToWhereLogic();
        }, this._onError.bind(this));
        select_object.execute();
    };
    return Instance;
}(Where));
export { Instance };
//# sourceMappingURL=instance.js.map