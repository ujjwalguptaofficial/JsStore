import { Select } from "./index";

// declare module "./index" {
//     interface Select {
//         methodY(): void;
//     }
// }

export const setPushResult = function (this: Select) {
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

export const setLimitAndSkipEvaluationAtEnd = function (this: Select) {
    if (this.query.limit) {
        this.shouldEvaluateLimitAtEnd = true;
    }
    if (this.query.skip) {
        this.shouldEvaluateSkipAtEnd = true;
    }
}

export const removeDuplicates = function (this: Select) {
    let datas = this.results;
    // free results memory
    this.results = null;
    const key = this.primaryKey;
    const lookupObject = {};
    for (let i = 0, len = datas.length; i < len; i++) {
        lookupObject[datas[i][key]] = datas[i];
    }
    datas = [];
    for (const i in lookupObject) {
        datas.push(lookupObject[i]);
    }
    this.results = datas;
}