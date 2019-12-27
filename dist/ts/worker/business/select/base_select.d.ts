import { WhereBase } from "../where_base";
import { SelectQuery, SelectCase } from "../../../common/index";
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
    isOrderWithLimit: boolean;
    isOrderWithSkip: boolean;
    protected pushResult(value: any): void;
    protected getThenValue(columnName: string, value: any, caseQuery: any): any;
    protected checkCase(columnName: string, cond: SelectCase, value: any): boolean;
    protected removeDuplicates(): void;
}
