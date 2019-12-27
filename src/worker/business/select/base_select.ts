import { WhereBase } from "../where_base";
import { SelectQuery, SelectCase, QUERY_OPTION } from "../../../common/index";


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

    isOrderWithLimit = false;
    isOrderWithSkip = false;

    protected pushResult(value) {
        for (const columnName in this.query.case) {
            value[columnName] = this.getThenValue(columnName, value, this.query.case);
        }
        this.results.push(value);
    }

    protected getThenValue(columnName: string, value, caseQuery: any) {
        const caseColumnQuery = caseQuery[columnName];
        const length = caseColumnQuery.length;
        const lastThen = caseColumnQuery[length - 1].then;
        const getLastThen = lastThen == null ? () => value[columnName] : () => lastThen;
        const checkCase = (cond: SelectCase) => {
            for (const queryOption in cond) {
                switch (queryOption) {
                    case QUERY_OPTION.GreaterThan:
                        if (value[columnName] > cond[queryOption]) {
                            return true;
                        } break;
                    case QUERY_OPTION.Equal:
                        if (value[columnName] === cond[queryOption]) {
                            return true;
                        } break;
                    case QUERY_OPTION.LessThan:
                        if (value[columnName] < cond[queryOption]) {
                            return true;
                        } break;
                    case QUERY_OPTION.GreaterThanEqualTo:
                        if (value[columnName] >= cond[queryOption]) {
                            return true;
                        } break;
                    case QUERY_OPTION.LessThanEqualTo:
                        if (value[columnName] <= cond[queryOption]) {
                            return true;
                        } break;
                    case QUERY_OPTION.NotEqualTo:
                        if (value[columnName] !== cond[queryOption]) {
                            return true;
                        }
                }
                return false;
            }
        };
        for (let i = 0; i < length; i++) {
            if (checkCase(caseColumnQuery[i]) === true) {
                return caseColumnQuery[i].then;
            }
        }
        return getLastThen();
    }

    protected checkCase(columnName: string, cond: SelectCase, value) {
        for (const queryOption in cond) {
            switch (queryOption) {
                case QUERY_OPTION.GreaterThan:
                    if (value[columnName] > cond[queryOption]) {
                        return true;
                    } break;
                case QUERY_OPTION.Equal:
                    if (value[columnName] === cond[queryOption]) {
                        return true;
                    } break;
                case QUERY_OPTION.LessThan:
                    if (value[columnName] < cond[queryOption]) {
                        return true;
                    } break;
                case QUERY_OPTION.GreaterThanEqualTo:
                    if (value[columnName] >= cond[queryOption]) {
                        return true;
                    } break;
                case QUERY_OPTION.LessThanEqualTo:
                    if (value[columnName] <= cond[queryOption]) {
                        return true;
                    } break;
                case QUERY_OPTION.NotEqualTo:
                    if (value[columnName] !== cond[queryOption]) {
                        return true;
                    }
            }
        }
        return false;
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