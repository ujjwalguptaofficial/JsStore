import * as KeyStore from "../keystore/index";
import { IdbHelper } from "../business/idb_helper";
var TableHelper = /** @class */ (function () {
    function TableHelper(table) {
        this._columns = [];
        this._requireDelete = false;
        this._requireCreation = false;
        this._name = table._name;
        this._version = table._version;
        this._columns = table._columns;
        this.setPrimaryKey();
    }
    TableHelper.prototype.createMetaData = function (dbName, callBack) {
        this._callback = callBack;
        this.setRequireDelete(dbName);
        this.setDbVersion(dbName);
    };
    TableHelper.prototype.setPrimaryKey = function () {
        this._columns.every(function (item) {
            this._primaryKey = item._primaryKey ? item._name : "";
            return !item._primaryKey;
        }, this);
    };
    TableHelper.prototype.setRequireDelete = function (dbName) {
        KeyStore.get("JsStore_" + dbName + "_" + this._name + "_Version", function (tableVersion) {
            if (tableVersion == null) {
                this._requireCreation = true;
            }
            else if (tableVersion < this._version) {
                this._requireDelete = true;
            }
        }.bind(this));
    };
    TableHelper.prototype.setDbVersion = function (dbName) {
        IdbHelper._dbVersion = IdbHelper._dbVersion > this._version ? IdbHelper._dbVersion : this._version;
        // setting db version
        KeyStore.set("JsStore_" + dbName + "_Db_Version", IdbHelper._dbVersion);
        // setting table version
        KeyStore.set("JsStore_" + dbName + "_" + this._name + "_Version", IdbHelper._dbVersion, this._callback);
        this._version = IdbHelper._dbVersion;
    };
    return TableHelper;
}());
export { TableHelper };
//# sourceMappingURL=table_helper.js.map