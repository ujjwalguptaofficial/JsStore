import { WhereBase } from "../where_base";
import { SelectQuery } from "../../../common/index";
import { ThenEvaluator } from "./then_evaluator";
export declare class BaseSelect extends WhereBase {
    sorted: boolean;
    isOr: boolean;
    isArrayQry: boolean;
    onWhereArrayQrySuccess: () => void;
    query: SelectQuery;
    orInfo: {
        results?: any[];
        orQuery: object;
    };
    isSubQuery: boolean;
    shouldEvaluateLimitAtEnd: boolean;
    shouldEvaluateSkipAtEnd: boolean;
    protected pushResult: (value: any) => void;
    protected thenEvaluator: ThenEvaluator;
    protected setPushResult(): void;
    protected removeDuplicates(): void;
}
