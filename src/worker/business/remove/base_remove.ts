import { WhereBase } from "../index";
import { RemoveQuery } from "../../types";

export class BaseRemove extends WhereBase {
   
    isOr: boolean;
    query: RemoveQuery;

    protected onQueryFinished() {
        // ff
    }
}
