import * as KeyStore from "../keystore/index";
import { IdbHelper } from "./idb_helper";
import { Connection_Status, Error_Type } from "../enums";
import { LogHelper } from "../log_helper";
var DropDb = /** @class */ (function () {
    function DropDb(onSuccess, onError) {
        this._onSuccess = onSuccess;
        this._onError = onError;
        this._dbName = IdbHelper._activeDb._name;
    }
    DropDb.prototype.deleteMetaData = function () {
        var _this = this;
        KeyStore.remove("JsStore_" + this._dbName + "_Db_Version");
        IdbHelper._activeDb._tables.forEach(function (table) {
            KeyStore.remove("JsStore_" + _this._dbName + "_" + table._name + "_Version");
            table._columns.forEach(function (column) {
                if (column._autoIncrement) {
                    KeyStore.remove("JsStore_" + this._dbName + "_" + table._name + "_" + column._name + "_Value");
                }
            });
        });
        // remove from database_list 
        IdbHelper.getDbList(function (result) {
            result.splice(result.indexOf(_this._dbName), 1);
            IdbHelper.setDbList(result);
        });
        KeyStore.remove("JsStore_" + this._dbName + "_Schema", this._onSuccess);
    };
    DropDb.prototype.deleteDb = function () {
        var _this = this;
        setTimeout(function () {
            var db_drop_request = indexedDB.deleteDatabase(_this._dbName);
            db_drop_request.onblocked = function () {
                if (_this._onError != null) {
                    _this._onError(new LogHelper(Error_Type.DbBlocked).get());
                }
            };
            db_drop_request.onerror = function (e) {
                if (_this._onError != null) {
                    _this._onError(event.target.error);
                }
            };
            db_drop_request.onsuccess = function () {
                IdbHelper._dbStatus.ConStatus = Connection_Status.Closed;
                _this.deleteMetaData();
            };
        }, 100);
    };
    return DropDb;
}());
export { DropDb };
//# sourceMappingURL=drop_db.js.map