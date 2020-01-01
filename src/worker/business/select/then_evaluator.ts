import { QUERY_OPTION, CaseOption } from "../../../common/index";

export class ThenEvaluator {
    private columnName_: string;
    private value;
    private caseQuery_: { [columnName: string]: [CaseOption] };
    private caseColumnQuery_: CaseOption[];
    private length_: number;

    setCaseAndValue(caseQuery: any, value) {
        this.caseQuery_ = caseQuery;
        this.setValue(value);
    }

    setCaseAndColumn(caseQuery: { [columnName: string]: [CaseOption] }, columnName: string) {
        this.caseQuery_ = caseQuery;
        this.setColumn(columnName);
        return this;
    }

    setColumn(columnName: string) {
        this.columnName_ = columnName;
        this.caseColumnQuery_ = this.caseQuery_[this.columnName_];
        this.length_ = this.caseColumnQuery_.length;
        return this;
    }

    setValue(value) {
        this.value = value;
        return this;
    }

    evaluate() {
        for (let i = 0; i < this.length_; i++) {
            if (this.checkCase_(this.caseColumnQuery_[i]) === true) {
                return this.caseColumnQuery_[i].then;
            }
        }
        const lastThen = this.caseColumnQuery_[this.length_ - 1].then;
        return lastThen == null ? this.value[this.columnName_] : lastThen;
    }

    evalauateThenVal(then) {
        return then.column == null ? then : this.value[then.column];
    }

    private checkCase_(cond: CaseOption) {
        let queryOption;
        for (queryOption in cond) {
            switch (queryOption) {
                case QUERY_OPTION.GreaterThan:
                    if (this.value[this.columnName_] > cond[queryOption]) {
                        return true;
                    } break;
                case QUERY_OPTION.Equal:
                    if (this.value[this.columnName_] === cond[queryOption]) {
                        return true;
                    } break;
                case QUERY_OPTION.LessThan:
                    if (this.value[this.columnName_] < cond[queryOption]) {
                        return true;
                    } break;
                case QUERY_OPTION.GreaterThanEqualTo:
                    if (this.value[this.columnName_] >= cond[queryOption]) {
                        return true;
                    } break;
                case QUERY_OPTION.LessThanEqualTo:
                    if (this.value[this.columnName_] <= cond[queryOption]) {
                        return true;
                    } break;
                case QUERY_OPTION.NotEqualTo:
                    if (this.value[this.columnName_] !== cond[queryOption]) {
                        return true;
                    } break;
                case QUERY_OPTION.Between:
                    if (this.value[this.columnName_] > cond[queryOption].low && this.value[this.columnName_] < cond[queryOption].high) {
                        return true;
                    } break;
            }
            return false;
        }
    }
}