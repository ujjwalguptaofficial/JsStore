namespace JsStore {
    export namespace Business {
        export namespace Select {
            export class BaseSelect extends Base {
                Results = [];
                Sorted: boolean = false;
                SkipRecord;
                LimitRecord;
                CheckFlag = false;

                protected removeDuplicates = function () {
                    var Datas = this.Results;
                    // free results memory
                    this.Results = undefined;
                    var Key = this.getPrimaryKey(this.Query.From);
                    var lookupObject = {};
                    for (var i in Datas) {
                        lookupObject[Datas[i][Key]] = Datas[i];
                    }
                    // free datas memory
                    Datas = [];
                    for (i in lookupObject) {
                        Datas.push(lookupObject[i]);
                    }
                    this.Results = Datas;
                };
            }
        }
    }
}