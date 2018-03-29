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
import { Base } from "./base";
import { Error_Type } from "../enums";
import { LogHelper } from "../log_helper";
import { IdbHelper } from './idb_helper';
var BulkInsert = /** @class */ (function (_super) {
    __extends(BulkInsert, _super);
    function BulkInsert(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this._query = query;
        _this._onSuccess = onSuccess;
        _this._onError = onError;
        return _this;
    }
    BulkInsert.prototype.execute = function () {
        if (!Array.isArray(this._query.values)) {
            this.onErrorOccured(new LogHelper(Error_Type.NotArray).get(), true);
        }
        else if (this.isTableExist(this._query.into) === true) {
            try {
                this.bulkinsertData();
            }
            catch (ex) {
                this.onExceptionOccured(ex, { TableName: this._query.into });
            }
        }
        else {
            var error = new LogHelper(Error_Type.TableNotExist, { TableName: this._query.into });
            error.throw();
        }
    };
    BulkInsert.prototype.bulkinsertData = function () {
        var _this = this;
        IdbHelper.createTransaction([this._query.into], function () {
            _this._onSuccess();
        });
        this._objectStore = IdbHelper._transaction.objectStore(this._query.into);
        this._query.values.forEach(function (value) {
            this._objectStore.add(value);
        }, this);
    };
    return BulkInsert;
}(Base));
export { BulkInsert };
//# sourceMappingURL=bulk_insert.js.map