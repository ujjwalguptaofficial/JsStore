import { ERROR_TYPE } from "@/common";
import { LogHelper } from "@/worker/utils";
import { Select } from "./index";

export const setPushResult = function (this: Select) {
    const caseQuery = this.query.case;
    if (caseQuery) {
        this.pushResult = (value) => {
            let columnName: string;
            this.thenEvaluator.setCaseAndValue(caseQuery, value);
            for (columnName in caseQuery) {
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
    const key = this.primaryKey();
    const lookupObject = new Map();
    for (let i = 0, len = datas.length; i < len; i++) {
        lookupObject.set(datas[i][key], datas[i]);
    }

    this.results = Array.from(lookupObject.values());
}