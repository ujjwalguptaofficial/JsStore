import { SelectCase } from "../../../common/types";
import { QUERY_OPTION } from "../../../common/index";

export class ThenEvaluator {
    private columnName: string;
    private value;
    private caseQuery;
    private caseColumnQuery: SelectCase[];
    private length: number;

    setCaseAndValue(caseQuery: any, value) {
        this.caseQuery = caseQuery;
        this.setValue(value);
    }

    setCaseAndColumn(caseQuery: any, columnName: string) {
        this.caseQuery = caseQuery;
        this.setColumn(columnName);
        return this;
    }

    setColumn(columnName: string) {
        this.columnName = columnName;
        this.caseColumnQuery = this.caseQuery[this.columnName];
        this.length = this.caseColumnQuery.length;
        return this;
    }

    setValue(value) {
        this.value = value;
        return this;
    }

    evaluate() {

        let lastThen = this.caseColumnQuery[this.length - 1].then;
        lastThen = lastThen == null ? this.value[this.columnName] : lastThen;

        for (let i = 0; i < this.length; i++) {
            if (this.checkCase(this.caseColumnQuery[i]) === true) {
                return this.caseColumnQuery[i].then;
            }
        }
        return lastThen;
    }

    private checkCase(cond: SelectCase) {
        let queryOption;
        for (queryOption in cond) {
            switch (queryOption) {
                case QUERY_OPTION.GreaterThan:
                    if (this.value[this.columnName] > cond[queryOption]) {
                        return true;
                    } break;
                case QUERY_OPTION.Equal:
                    if (this.value[this.columnName] === cond[queryOption]) {
                        return true;
                    } break;
                case QUERY_OPTION.LessThan:
                    if (this.value[this.columnName] < cond[queryOption]) {
                        return true;
                    } break;
                case QUERY_OPTION.GreaterThanEqualTo:
                    if (this.value[this.columnName] >= cond[queryOption]) {
                        return true;
                    } break;
                case QUERY_OPTION.LessThanEqualTo:
                    if (this.value[this.columnName] <= cond[queryOption]) {
                        return true;
                    } break;
                case QUERY_OPTION.NotEqualTo:
                    if (this.value[this.columnName] !== cond[queryOption]) {
                        return true;
                    }
            }
            return false;
        }
    }
}