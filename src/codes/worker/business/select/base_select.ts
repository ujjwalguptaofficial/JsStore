import { Base } from "../base";

export class BaseSelect extends Base {
    results = [];
    sorted = false;
    skipRecord;
    limitRecord;
    isOr: boolean;
    isArrayQry: boolean;
    onWhereArrayQrySuccess: () => void;

    protected removeDuplicates() {
        let datas = this.results;
        // free results memory
        this.results = undefined;
        const key = this.getPrimaryKey(this.query.from);
        const lookupObject = {};
        for (const i in datas) {
            lookupObject[datas[i][key]] = datas[i];
        }
        // free datas memory
        datas = [];
        for (const i in lookupObject) {
            datas.push(lookupObject[i]);
        }
        this.results = datas;
    }

    protected onQueryFinished() {
        // ff
    }
}