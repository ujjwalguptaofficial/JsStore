import { Connection_Status } from "../enums";
import * as KeyStore from "../keystore/index";
import { DataBase } from "../model/database";
import { DropDb } from "./drop_db";
var IdbHelper = /** @class */ (function () {
    function IdbHelper() {
    }
    IdbHelper.callDbDroppedByBrowser = function (deleteMetaData) {
        if (this._dbStatus.ConStatus === Connection_Status.Connected) {
            this._isDbDeletedByBrowser = true;
            if (deleteMetaData === true) {
                var drop_db_object = new DropDb(this._onDbDroppedByBrowser, null);
                drop_db_object.deleteMetaData();
            }
        }
    };
    IdbHelper.createTransaction = function (tableNames, callBack, mode) {
        var _this = this;
        if (this._transaction === null) {
            mode = mode ? mode : "readwrite";
            this._transaction = this._dbConnection.transaction(tableNames, mode);
            this._transaction.oncomplete = function () {
                _this._transaction = null;
                callBack();
            };
            this._transaction.ontimeout = function () {
                _this._transaction = null;
                console.error('transaction timed out');
            };
        }
    };
    IdbHelper.setDbList = function (list) {
        KeyStore.set('database_list', list);
    };
    IdbHelper.updateDbStatus = function (status, err) {
        if (err === undefined) {
            this._dbStatus.ConStatus = status;
        }
        else {
            this._dbStatus = {
                ConStatus: status,
                LastError: err
            };
        }
    };
    IdbHelper.getDbList = function (callback) {
        KeyStore.get('Database_List', function (result) {
            result = result == null ? [] : result;
            callback(result);
        });
    };
    IdbHelper.getDbVersion = function (dbName, callback) {
        KeyStore.get("JsStore_" + dbName + "_Db_Version", function (dbVersion) {
            callback.call(this, Number(dbVersion));
        }.bind(this));
    };
    IdbHelper.getDbSchema = function (dbName, callback) {
        KeyStore.get("JsStore_" + dbName + "_Schema", function (result) {
            if (result) {
                if (result._name) {
                    callback(result);
                }
                else {
                    var db_schema = new DataBase(result);
                    KeyStore.set("JsStore_" + dbName + "_Schema", db_schema);
                    callback(db_schema);
                }
            }
            else {
                callback(result);
            }
        });
    };
    IdbHelper._transaction = null;
    IdbHelper._dbVersion = 0;
    IdbHelper._dbStatus = {
        ConStatus: Connection_Status.NotStarted,
        LastError: null
    };
    return IdbHelper;
}());
export { IdbHelper };
//# sourceMappingURL=idb_helper.js.map