import { Base } from "../base";
import { ISelect } from "../../interfaces";
export declare class BaseSelect extends Base {
    results: any[];
    sorted: boolean;
    isOr: boolean;
    isArrayQry: boolean;
    onWhereArrayQrySuccess: () => void;
    query: ISelect;
    orInfo: {
        results?: any[];
        orQuery: object;
    };
    isSubQuery: boolean;
    isOrderWithLimit: boolean;
    protected removeDuplicates(): void;
    protected onQueryFinished(): void;
}
