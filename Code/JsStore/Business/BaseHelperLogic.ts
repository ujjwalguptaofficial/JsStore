module JsStore {
    export module Business {
        export class BaseHelper {

            protected getTable = function (tableName: string) {
                var CurrentTable: Table,
                    That = this;
                ActiveDataBase.Tables.every(function (table) {
                    if (table.Name == tableName) {
                        CurrentTable = table;
                        return false;
                    }
                    return true;
                });
                return CurrentTable;
            }

            protected getKeyRange = function (value, op) {
                var KeyRange: IDBKeyRange;
                switch (op) {
                    case '-': KeyRange = IDBKeyRange.bound(value.Low, value.High, false, false); break;
                    case '>': KeyRange = IDBKeyRange.lowerBound(value, true); break;
                    case '>=': KeyRange = IDBKeyRange.lowerBound(value); break;
                    case '<': KeyRange = IDBKeyRange.upperBound(value, true); break;
                    case '<=': KeyRange = IDBKeyRange.upperBound(value); break;
                    default: KeyRange = IDBKeyRange.only(value); break;
                }
                return KeyRange;

            }

            protected getObjectSecondKey = function (value) {
                var IsSecond = false;
                for (var key in value) {
                    if (IsSecond) {
                        return key;
                    }
                    else {
                        IsSecond = true;
                    }
                }
            }

            protected getPrimaryKey = function (tableName) {
                var PrimaryKey = this.getTable(tableName).PrimaryKey
                return PrimaryKey ? PrimaryKey : this.getKeyPath();
            };

            private getKeyPath = function (tableName) {
                var Transaction: IDBTransaction = DbConnection.transaction([tableName], "readonly"),
                    ObjectStore = Transaction.objectStore(tableName);
                return ObjectStore.keyPath;
            }

            protected sortNumberInAsc = function (values) {
                values.sort(function (a, b) {
                    return a - b;
                });
                return values;
            }

            protected sortNumberInDesc = function (values) {
                values.sort(function (a, b) {
                    return b - a;
                });
                return values;
            }

            protected sortAlphabetInAsc = function (values) {
                values.sort(function (a, b) {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                });
                return values;
            }

            protected sortAlphabetInDesc = function (values) {
                values.sort(function (a, b) {
                    return b.toLowerCase().localeCompare(a.toLowerCase());
                });
                return values;
            };

            private getCombination(word: string) {
                var Results = [],
                    doAndPushCombination = function (word: string, chars, index: number) {
                        if (index == word.length) {
                            Results.push(chars.join(""));
                        } else {
                            var ch = word.charAt(index);
                            chars[index] = ch.toLowerCase();
                            doAndPushCombination(word, chars, index + 1);
                            chars[index] = ch.toUpperCase();
                            doAndPushCombination(word, chars, index + 1);
                        }
                    };
                doAndPushCombination(word, [], 0);
                return Results;
            }

            protected getAllCombinationOfWord(word, isArray) {
                if (isArray) {
                    var Results = [];
                    for (var i = 0, length = word.length; i < length; i++) {
                        Results = Results.concat(this.getCombination(word[i]))
                    }
                    return Results;
                }
                else {
                    return this.getCombination(word);
                }
            }
        }
    }

}
