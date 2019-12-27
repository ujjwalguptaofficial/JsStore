import { WhereBase } from "../where_base";
import { RemoveQuery } from "../../../common/index";

export class BaseRemove extends WhereBase {

    isOr: boolean;
    query: RemoveQuery;

    protected onQueryFinished() {
        // ff
    }
}
