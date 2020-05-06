import { WhereBase } from "../where_base";
import { SelectQuery, CaseOption, QUERY_OPTION } from "../../../common/index";
import { ThenEvaluator } from "./then_evaluator";


export class BaseSelect extends WhereBase {
    sorted = false;
    isOr: boolean;
    isArrayQry: boolean;
    onWhereArrayQrySuccess: () => void;
    query: SelectQuery;
    orInfo: {
        results?: any[];
        orQuery: object
    };

    isSubQuery = false;

    shouldEvaluateLimitAtEnd = false;
    shouldEvaluateSkipAtEnd = false;

    protected pushResult: (value) => void;

    protected thenEvaluator = new ThenEvaluator();

    protected setPushResult() {
        if (this.query.case) {
            this.pushResult = (value) => {
                let columnName: string;
                this.thenEvaluator.setCaseAndValue(this.query.case, value);
                for (columnName in this.query.case) {
                    value[columnName] = this.thenEvaluator.setColumn(columnName).evaluate();
                }
                this.results.push(value);
            };
        }
        else {
            this.pushResult = (value) => {
                this.results.push(value);
            };
        }
    }

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
}