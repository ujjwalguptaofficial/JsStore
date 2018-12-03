import { Base } from "../base";
import { CountQuery } from "../../types";
export declare class BaseCount extends Base {
    resultCount: number;
    query: CountQuery;
    protected onQueryFinished(): void;
    protected onTransactionCompleted_: () => void;
}
