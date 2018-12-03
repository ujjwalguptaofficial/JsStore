import { Base } from "../base";
import { RemoveQuery } from "../../types";

export class BaseRemove extends Base {
   
    isOr: boolean;
    query: RemoveQuery;

    protected onQueryFinished() {
        // ff
    }
}
