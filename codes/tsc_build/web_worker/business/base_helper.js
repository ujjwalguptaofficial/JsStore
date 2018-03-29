import { Occurence } from "../enums";
import { IdbHelper } from "./idb_helper";
var BaseHelper = /** @class */ (function () {
    function BaseHelper() {
        this.filterOnOccurence = function (value) {
            var found = false;
            value = value.toLowerCase();
            switch (this._compSymbol) {
                case Occurence.Any:
                    if (value.indexOf(this._compValue) >= 0) {
                        found = true;
                    }
                    break;
                case Occurence.First:
                    if (value.indexOf(this._compValue) === 0) {
                        found = true;
                    }
                    break;
                case Occurence.Last:
                    if (value.lastIndexOf(this._compValue) === value.length - this._compValueLength) {
                        found = true;
                    }
                    break;
                default: if (value !== this._compValue) {
                    found = true;
                }
            }
            return found;
        };
    }
    BaseHelper.prototype.containsNot = function (whereQry) {
        var status = false, value;
        Object.keys(whereQry).every(function (key) {
            value = whereQry[key];
            if (value['!=']) {
                status = true;
            }
            return !status;
        });
        return status;
    };
    BaseHelper.prototype.isTableExist = function (tableName) {
        var is_exist = false;
        IdbHelper._activeDb._tables.every(function (table) {
            if (table._name === tableName) {
                is_exist = true;
                return false;
            }
            return true;
        });
        return is_exist;
    };
    BaseHelper.prototype.getTable = function (tableName) {
        var current_table;
        IdbHelper._activeDb._tables.every(function (table) {
            if (table._name === tableName) {
                current_table = table;
                return false;
            }
            return true;
        });
        return current_table;
    };
    BaseHelper.prototype.getKeyRange = function (value, op) {
        var key_range;
        switch (op) {
            case '-':
                key_range = IDBKeyRange.bound(value.Low, value.High, false, false);
                break;
            case '>':
                key_range = IDBKeyRange.lowerBound(value, true);
                break;
            case '>=':
                key_range = IDBKeyRange.lowerBound(value);
                break;
            case '<':
                key_range = IDBKeyRange.upperBound(value, true);
                break;
            case '<=':
                key_range = IDBKeyRange.upperBound(value);
                break;
            default:
                key_range = IDBKeyRange.only(value);
                break;
        }
        return key_range;
    };
    BaseHelper.prototype.getPrimaryKey = function (tableName) {
        var primary_key = this.getTable(tableName)._primaryKey;
        return primary_key ? primary_key : this.getKeyPath(tableName);
    };
    BaseHelper.prototype.getKeyPath = function (tableName) {
        var transaction = IdbHelper._dbConnection.transaction([tableName], "readonly"), object_store = transaction.objectStore(tableName);
        return object_store.keyPath;
    };
    BaseHelper.prototype.sortNumberInAsc = function (values) {
        values.sort(function (a, b) {
            return a - b;
        });
        return values;
    };
    BaseHelper.prototype.sortNumberInDesc = function (values) {
        values.sort(function (a, b) {
            return b - a;
        });
        return values;
    };
    BaseHelper.prototype.sortAlphabetInAsc = function (values) {
        values.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        return values;
    };
    BaseHelper.prototype.sortAlphabetInDesc = function (values) {
        values.sort(function (a, b) {
            return b.toLowerCase().localeCompare(a.toLowerCase());
        });
        return values;
    };
    BaseHelper.prototype.getAllCombinationOfWord = function (word, isArray) {
        if (isArray) {
            var results = [];
            for (var i = 0, length = word.length; i < length; i++) {
                results = results.concat(this.getCombination(word[i]));
            }
            return results;
        }
        else {
            return this.getCombination(word);
        }
    };
    BaseHelper.prototype.getCombination = function (word) {
        var results = [], doAndPushCombination = function (subWord, chars, index) {
            if (index === subWord.length) {
                results.push(chars.join(""));
            }
            else {
                var ch = subWord.charAt(index);
                chars[index] = ch.toLowerCase();
                doAndPushCombination(subWord, chars, index + 1);
                chars[index] = ch.toUpperCase();
                doAndPushCombination(subWord, chars, index + 1);
            }
        };
        doAndPushCombination(word, [], 0);
        return results;
    };
    return BaseHelper;
}());
export { BaseHelper };
//# sourceMappingURL=base_helper.js.map