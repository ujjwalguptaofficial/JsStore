import { WhereBase } from "../where_base";
import { RemoveQuery } from "../../../common/index";
export declare class BaseRemove extends WhereBase {
    isOr: boolean;
    query: RemoveQuery;
    protected onQueryFinished(): void;
}
