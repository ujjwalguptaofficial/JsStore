import { Base } from "../base";
import { ICount } from "../../interfaces";
export declare class BaseCount extends Base {
    resultCount: number;
    query: ICount;
    protected onQueryFinished(): void;
    protected onTransactionCompleted_: () => void;
}
