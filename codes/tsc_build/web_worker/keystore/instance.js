var _this = this;
import { Utils } from "./utils_logic";
import { QueryExecutor } from './query_executor';
/**
 * Initialize KeyStore
 *
 */
export var init = function () {
    Utils.setDbType();
    if (indexedDB) {
        QueryExecutor.prcoessQuery({
            Name: 'create_db',
            Query: null
        });
    }
};
/**
 * return the value by key
 *
 * @param {string} key
 * @param {(result) => void} onSuccess
 * @param {(err: IError) => void} [onError=null]
 * @returns
 */
export var get = function (key, onSuccess, onError) {
    if (onError === void 0) { onError = null; }
    QueryExecutor.prcoessQuery({
        Name: 'get',
        OnError: onError,
        OnSuccess: onSuccess,
        Query: key
    });
    return _this;
};
/**
 * insert or update value
 *
 * @param {any} key
 * @param {any} value
 * @param {(result) => void} [onSuccess]
 * @param {(err: IError) => void} [onError]
 * @returns
 */
export var set = function (key, value, onSuccess, onError) {
    var query = {
        Key: key,
        Value: value
    };
    QueryExecutor.prcoessQuery({
        Name: 'set',
        OnError: onError,
        OnSuccess: onSuccess,
        Query: query
    });
    return _this;
};
/**
 * delete value
 *
 * @param {string} key
 * @param {(result) => void} [onSuccess=null]
 * @param {(err: IError) => void} [onError=null]
 * @returns
 */
export var remove = function (key, onSuccess, onError) {
    if (onSuccess === void 0) { onSuccess = null; }
    if (onError === void 0) { onError = null; }
    QueryExecutor.prcoessQuery({
        Name: 'remove',
        OnError: onError,
        OnSuccess: onSuccess,
        Query: key
    });
    return _this;
};
//# sourceMappingURL=instance.js.map