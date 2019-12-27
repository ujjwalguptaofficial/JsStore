import { WhereBase } from "../where_base";
import { SelectQuery } from "../../types";
import { QUERY_OPTION } from "../../enums";

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
        const checkCase = (columnName, cond) => {
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
        };
        for (const columnName in this.query.case) {
            const caseColumnQuery = this.query.case[columnName];
            let isNotConditionMet = true;
            caseColumnQuery.every((qry) => {
                if (checkCase(columnName, qry) === true) {
                    isNotConditionMet = false;
                    value[columnName] = qry.then;
                    return false;
                }
                return true;
            });
            if (isNotConditionMet === true) {
                value[columnName] = caseColumnQuery[caseColumnQuery.length - 1].then;
            }
        }
        return this.results.push(value);
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