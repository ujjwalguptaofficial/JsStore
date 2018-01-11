namespace JsStore {
    export namespace Business {
        export class BaseHelper {

            protected filterOnOccurence = function (value) {
                var found = false;
                value = value.toLowerCase();
                switch (this._compSymbol) {
                    case Occurence.Any: if (value.indexOf(this._compValue) >= 0) {
                        found = true;
                    } break;
                    case Occurence.First: if (value.indexOf(this._compValue) === 0) {
                        found = true;
                    } break;
                    default: if (value.lastIndexOf(this._compValue) === value.length - this.CompValueLength) {
                        found = true;
                    }
                }
                return found;
            };

            protected getArrayFromWord = function (word: string) {
                return word.split(" ");
            };

            protected getTable = function (tableName: string) {
                var current_table: Table;
                active_db._tables.every(function (table) {
                    if (table._name === tableName) {
                        current_table = table;
                        return false;
                    }
                    return true;
                });
                return current_table;
            };

            protected getKeyRange = function (value, op) {
                var key_range: IDBKeyRange;
                switch (op) {
                    case '-': key_range = IDBKeyRange.bound(value.Low, value.High, false, false); break;
                    case '>': key_range = IDBKeyRange.lowerBound(value, true); break;
                    case '>=': key_range = IDBKeyRange.lowerBound(value); break;
                    case '<': key_range = IDBKeyRange.upperBound(value, true); break;
                    case '<=': key_range = IDBKeyRange.upperBound(value); break;
                    default: key_range = IDBKeyRange.only(value); break;
                }
                return key_range;

            };

            protected getObjectSecondKey = function (value) {
                var is_second = false;
                for (var key in value) {
                    if (is_second) {
                        return key;
                    }
                    else {
                        is_second = true;
                    }
                }
            };

            protected getPrimaryKey = function (tableName) {
                var primary_key = (this.getTable(tableName) as Table)._primaryKey;
                return primary_key ? primary_key : this.getKeyPath(tableName);
            };

            protected getKeyPath = function (tableName) {
                var transaction: IDBTransaction = db_connection.transaction([tableName], "readonly"),
                    object_store = transaction.objectStore(tableName);
                return object_store.keyPath;
            };

            protected sortNumberInAsc = function (values) {
                values.sort(function (a, b) {
                    return a - b;
                });
                return values;
            };

            protected sortNumberInDesc = function (values) {
                values.sort(function (a, b) {
                    return b - a;
                });
                return values;
            };

            protected sortAlphabetInAsc = function (values) {
                values.sort(function (a, b) {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                });
                return values;
            };

            protected sortAlphabetInDesc = function (values) {
                values.sort(function (a, b) {
                    return b.toLowerCase().localeCompare(a.toLowerCase());
                });
                return values;
            };

            protected getAllCombinationOfWord(word, isArray) {
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
            }

            private getCombination(word: string) {
                var results = [],
                    doAndPushCombination = function (subWord: string, chars, index: number) {
                        if (index === subWord.length) {
                            results.push(chars.join(""));
                        } else {
                            var ch = subWord.charAt(index);
                            chars[index] = ch.toLowerCase();
                            doAndPushCombination(subWord, chars, index + 1);
                            chars[index] = ch.toUpperCase();
                            doAndPushCombination(subWord, chars, index + 1);
                        }
                    };
                doAndPushCombination(word, [], 0);
                return results;
            }
        }
    }

}
