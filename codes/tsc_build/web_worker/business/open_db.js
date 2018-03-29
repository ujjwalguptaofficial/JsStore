import { IdbHelper } from "./idb_helper";
import { Connection_Status, Error_Type } from "../enums";
import { LogHelper } from "../log_helper";
var OpenDb = /** @class */ (function () {
    function OpenDb(onSuccess, onError) {
        this._dbName = IdbHelper._activeDb._name;
        this._onSuccess = onSuccess;
        this._onError = onError;
    }
    OpenDb.prototype.execute = function () {
        var _this = this;
        if (this._dbName.length > 0) {
            var db_request = indexedDB.open(this._dbName, IdbHelper._dbVersion);
            db_request.onerror = function (event) {
                if (_this._onError != null) {
                    _this._onError(event.target.error);
                }
            };
            db_request.onsuccess = function (event) {
                IdbHelper._dbStatus.ConStatus = Connection_Status.Connected;
                IdbHelper._dbConnection = db_request.result;
                IdbHelper._dbConnection.onclose = function (e) {
                    IdbHelper.callDbDroppedByBrowser();
                    IdbHelper.updateDbStatus(Connection_Status.Closed, Error_Type.ConnectionClosed);
                };
                IdbHelper._dbConnection.onversionchange = function (e) {
                    if (e.newVersion === null) {
                        if (e.newVersion === null) {
                            e.target.close(); // Manually close our connection to the db
                            IdbHelper.callDbDroppedByBrowser(true);
                            IdbHelper.updateDbStatus(Connection_Status.Closed, Error_Type.ConnectionClosed);
                        }
                    }
                };
                IdbHelper._dbConnection.onerror = function (e) {
                    IdbHelper._dbStatus.LastError = ("Error occured in connection :" + e.target.result);
                };
                IdbHelper._dbConnection.onabort = function (e) {
                    IdbHelper._dbStatus.ConStatus = Connection_Status.Closed;
                    IdbHelper._dbStatus.LastError = Error_Type.ConnectionAborted;
                };
                if (_this._onSuccess != null) {
                    _this._onSuccess();
                }
                _this.setPrimaryKey();
            };
        }
        else {
            var error = new LogHelper(Error_Type.UndefinedDbName);
            error.throw();
        }
    };
    OpenDb.prototype.setPrimaryKey = function () {
        IdbHelper._activeDb._tables.forEach(function (table, index) {
            table._columns.every(function (item) {
                IdbHelper._activeDb._tables[index]._primaryKey = item._primaryKey ? item._name : "";
                return !item._primaryKey;
            });
        });
    };
    return OpenDb;
}());
export { OpenDb };
//# sourceMappingURL=open_db.js.map