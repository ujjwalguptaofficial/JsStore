module JsStore {
    export module Business {
        export module Select {
            export class BaseSelect extends Base {
                Results = [];
                Sorted: boolean = false;
                SkipRecord;
                LimitRecord;
                CheckFlag = false;

                protected removeDuplicates = function () {
                    var Datas = this.Results;
                    //free results memory
                    this.Results = undefined;
                    var Key = this.getPrimaryKey(this.Query.From);
                    var lookupObject = {};
                    for (var i in Datas) {
                        lookupObject[Datas[i][Key]] = Datas[i];
                    }
                    //free datas memory
                    Datas = [];
                    for (i in lookupObject) {
                        Datas.push(lookupObject[i]);
                    }
                    this.Results = Datas;
                };

                protected getPrimaryKey = function (tableName) {
                    var PrimaryKey = this.getTable(tableName).PrimaryKey
                    return PrimaryKey ? PrimaryKey : this.getKeyPath();
                };

                protected getKeyPath = function (tableName) {
                    var Transaction: IDBTransaction = DbConnection.transaction([tableName], "readonly"),
                        ObjectStore = Transaction.objectStore(tableName);
                    return ObjectStore.keyPath;
                }
            }
        }
    }
}