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
import { Base } from "../base";
import { Error_Type } from "../../enums";
import { LogHelper } from "../../log_helper";
import { ValuesChecker } from "./values_checker";
import { IdbHelper } from '../idb_helper';
var Instance = /** @class */ (function (_super) {
    __extends(Instance, _super);
    function Instance(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this._valuesAffected = [];
        _this._onError = onError;
        _this._query = query;
        _this._onSuccess = onSuccess;
        _this._tableName = _this._query.into;
        return _this;
    }
    Instance.prototype.execute = function () {
        var table = this.getTable(this._tableName);
        if (!Array.isArray(this._query.values)) {
            this.onErrorOccured(new LogHelper(Error_Type.NotArray).get(), true);
        }
        else if (table) {
            try {
                if (this._query.skipDataCheck) {
                    this.insertData(this._query.values);
                }
                else {
                    var value_checker_obj = new ValuesChecker(table, this._query.values);
                    value_checker_obj.checkAndModifyValues(function (isError) {
                        if (isError) {
                            this.onErrorOccured(value_checker_obj._error, true);
                        }
                        else {
                            this.insertData(value_checker_obj._values);
                        }
                        value_checker_obj = undefined;
                    }.bind(this));
                }
                // remove values from query
                this._query.values = undefined;
            }
            catch (ex) {
                this.onExceptionOccured(ex, { TableName: this._tableName });
            }
        }
        else {
            new LogHelper(Error_Type.TableNotExist, { TableName: this._tableName }).throw();
        }
    };
    Instance.prototype.onTransactionCompleted = function () {
        if (this._errorOccured === false) {
            this._onSuccess(this._query.return ? this._valuesAffected : this._rowAffected);
        }
    };
    Instance.prototype.onQueryFinished = function () {
        if (this._isTransaction === true) {
            this.onTransactionCompleted();
        }
    };
    Instance.prototype.insertData = function (values) {
        var value_index = 0, insertDataIntoTable;
        if (this._query.return) {
            insertDataIntoTable = function (value) {
                if (value) {
                    var add_result = object_store.add(value);
                    add_result.onerror = this.onErrorOccured.bind(this);
                    add_result.onsuccess = function (e) {
                        this._valuesAffected.push(value);
                        insertDataIntoTable.call(this, values[value_index++]);
                    }.bind(this);
                }
                else {
                    this.onQueryFinished();
                }
            };
        }
        else {
            insertDataIntoTable = function (value) {
                if (value) {
                    var add_result = object_store.add(value);
                    add_result.onerror = this.onErrorOccured.bind(this);
                    add_result.onsuccess = function (e) {
                        ++this._rowAffected;
                        insertDataIntoTable.call(this, values[value_index++]);
                    }.bind(this);
                }
                else {
                    this.onQueryFinished();
                }
            };
        }
        IdbHelper.createTransaction([this._query.into], this.onTransactionCompleted.bind(this));
        var object_store = IdbHelper._transaction.objectStore(this._query.into);
        insertDataIntoTable.call(this, values[value_index++]);
    };
    return Instance;
}(Base));
export { Instance };
//# sourceMappingURL=instance.js.map