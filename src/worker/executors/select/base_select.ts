import { LogHelper } from "@/worker/utils";
import { Select } from "./index";
import { ERROR_TYPE } from "@/common";

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
        this.limitAtEnd = true;
    }
    if (this.query.skip) {
        this.skipAtEnd = true;
    }
}

export const mergeWithResults = function (this: Select, from: any[]) {
    let datas = this.results;
    const key = this.primaryKey();
    if (process.env.NODE_ENV !== 'production' && !key) {
        new LogHelper(ERROR_TYPE.NoPrimaryKey, this.query).warn();
    }
    const lookupObject = new Map();
    for (let i = 0, len = datas.length; i < len; i++) {
        lookupObject.set(datas[i][key], 1);
    }

    from.forEach(item => {
        if (!lookupObject.has(item[key])) {
            datas.push(item);
        }
    });

    // this.results = Array.from(lookupObject.values());
}
