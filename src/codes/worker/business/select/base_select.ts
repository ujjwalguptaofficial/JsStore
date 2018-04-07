import { Base } from "../base";

export class BaseSelect extends Base {
    _results = [];
    _sorted: boolean = false;
    _skipRecord;
    _limitRecord;
    _checkFlag = false;
    _isOr: boolean;
    _isArrayQry: boolean;
    _onWhereArrayQrySuccess: () => void;

    protected removeDuplicates() {
        var datas = this._results;
        // free results memory
        this._results = undefined;
        var key = this.getPrimaryKey(this.query.from);
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
    }
    
    protected onQueryFinished()
    {
        // ff
    }
}