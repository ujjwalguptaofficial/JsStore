import { Base } from "../base";
import { IRemove } from "../../interfaces";
export declare class BaseRemove extends Base {
    isOr: boolean;
    query: IRemove;
    protected onQueryFinished(): void;
}
