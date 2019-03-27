import { WhereBase } from "../where_base";
import { RemoveQuery } from "../../types";
export declare class BaseRemove extends WhereBase {
    isOr: boolean;
    query: RemoveQuery;
    protected onQueryFinished(): void;
}
