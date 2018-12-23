import { Base } from "../base";
import { SelectQuery } from "../../types";
export declare class BaseSelect extends Base {
    results: any[];
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
    protected removeDuplicates(): void;
    protected onQueryFinished(): void;
}
