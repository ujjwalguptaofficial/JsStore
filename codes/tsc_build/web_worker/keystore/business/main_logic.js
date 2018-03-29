import { QueryExecutor } from '../query_executor';
import { Connection_Status } from "../enums";
import { Remove } from "./remove_logic";
import { Set } from "./set_logic";
import { InitDb } from "./init_db_logic";
import { Get } from "./get_logic";
import { IdbHelper } from './idb_helper';
var Main = /** @class */ (function () {
    function Main(onSuccess) {
        if (onSuccess === void 0) { onSuccess = null; }
        this._onSuccess = onSuccess;
    }
    Main.prototype.set = function (query, onSuccess, onError) {
        var obj_insert = new Set(query, onSuccess, onError);
        obj_insert.execute();
    };
    Main.prototype.remove = function (key, onSuccess, onError) {
        var obj_delete = new Remove(key, onSuccess, onError);
        obj_delete.execute();
    };
    Main.prototype.get = function (key, onSuccess, onError) {
        var get_object = new Get(key, onSuccess, onError);
        get_object.execute();
    };
    Main.prototype.createDb = function (onSuccess, onError) {
        var db_name = "KeyStore";
        var init_db_object = new InitDb(db_name, onSuccess, onError);
    };
    Main.prototype.checkConnectionAndExecuteLogic = function (request) {
        var _this = this;
        if (request.Name === 'create_db' || request.Name === 'open_db') {
            this.executeLogic(request);
        }
        else {
            switch (QueryExecutor._dbStatus.ConStatus) {
                case Connection_Status.Connected:
                    this.executeLogic(request);
                    break;
                case Connection_Status.NotStarted:
                    setTimeout(function () {
                        this.checkConnectionAndExecuteLogic(request);
                    }.bind(this), 100);
                    break;
                case Connection_Status.Closed:
                    if (IdbHelper._isDbDeletedByBrowser) {
                        this.createDb(function () {
                            IdbHelper._isDbDeletedByBrowser = false;
                            _this.checkConnectionAndExecuteLogic(request);
                        }, function (err) {
                            console.error(err);
                        });
                    }
            }
        }
    };
    Main.prototype.returnResult = function (result) {
        if (this._onSuccess) {
            this._onSuccess(result);
        }
    };
    Main.prototype.executeLogic = function (request) {
        var onSuccess = function (results) {
            this.returnResult({
                ReturnedValue: results
            });
        }.bind(this), onError = function (err) {
            this.returnResult({
                ErrorDetails: err,
                ErrorOccured: true
            });
        }.bind(this);
        switch (request.Name) {
            case 'get':
                this.get(request.Query, onSuccess, onError);
                break;
            case 'set':
                this.set(request.Query, onSuccess, onError);
                break;
            case 'remove':
                this.remove(request.Query, onSuccess, onError);
                break;
            case 'create_db':
                this.createDb(onSuccess, onError);
                break;
        }
    };
    return Main;
}());
export { Main };
//# sourceMappingURL=main_logic.js.map