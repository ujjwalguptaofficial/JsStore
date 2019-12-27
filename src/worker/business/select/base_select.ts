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
            const caseColumnQuery = this.query.case[columnName];
            const length = caseColumnQuery.length;
            const lastThen = caseColumnQuery[length - 1].then;
            const getLastThen = lastThen == null ? () => value[columnName] : () => lastThen;
            const modifyValueBasedOnCase = () => {
                for (let i = 0; i < length; i++) {
                    if (this.checkCase(columnName, caseColumnQuery[i], value) === true) {
                        return caseColumnQuery[i].then;
                    }
                }
                return getLastThen();
            };
            value[columnName] = modifyValueBasedOnCase();
        }
        this.results.push(value);
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