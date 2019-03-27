import { WhereBase } from "../where_base";
import { RemoveQuery } from "../../types";

export class BaseRemove extends WhereBase {
   
    isOr: boolean;
    query: RemoveQuery;

    protected onQueryFinished() {
        // ff
    }
}
