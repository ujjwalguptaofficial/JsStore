import { Base } from "../base";
import { IRemove } from "../../interfaces";

export class BaseRemove extends Base {
    checkFlag = false;
    isOr: boolean;
    query: IRemove;

    protected onQueryFinished() {
        // ff
    }
}
