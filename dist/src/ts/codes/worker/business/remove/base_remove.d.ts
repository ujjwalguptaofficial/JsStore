import { Base } from "../base";
import { RemoveQuery } from "../../types";
export declare class BaseRemove extends Base {
    isOr: boolean;
    query: RemoveQuery;
    protected onQueryFinished(): void;
}
