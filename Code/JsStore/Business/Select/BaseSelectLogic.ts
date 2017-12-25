namespace JsStore {
    export namespace Business {
        export namespace Select {
            export class BaseSelect extends Base {
                _results = [];
                _sorted: boolean = false;
                _skipRecord;
                _limitRecord;
                _checkFlag = false;

                protected removeDuplicates = function () {
                    var datas = this._results;
                    // free results memory
                    this._results = undefined;
                    var key = this.getPrimaryKey(this._query.From);
                    var lookupObject = {};
                    for (var i in datas) {
                        lookupObject[datas[i][key]] = datas[i];
                    }
                    // free datas memory
                    datas = [];
                    for (i in lookupObject) {
                        datas.push(lookupObject[i]);
                    }
                    this._results = datas;
                };
            }
        }
    }
}