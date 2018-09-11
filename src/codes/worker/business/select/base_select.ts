import { Base } from "../base";
import { ISelect } from "../../interfaces";

export class BaseSelect extends Base {
    results = [];
    sorted = false;
    isOr: boolean;
    isArrayQry: boolean;
    onWhereArrayQrySuccess: () => void;
    query: ISelect;
    orInfo: {
        results?: any[];
        orQuery: object
    };

    isSubQuery = false;

    isOrderWithLimit = false;
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