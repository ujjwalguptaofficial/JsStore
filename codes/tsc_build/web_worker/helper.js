import { Config } from "./config";
var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.getObjectFirstKey = function (value) {
        for (var key in value) {
            return key;
        }
        return null;
    };
    Helper.log = function (msg) {
        if (Config._isLogEnabled) {
            console.log(msg);
        }
    };
    Helper.logError = function (msg) {
        if (Config._isLogEnabled) {
            console.error(msg);
        }
    };
    return Helper;
}());
export { Helper };
//# sourceMappingURL=helper.js.map