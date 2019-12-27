import { WhereBase } from "../where_base";
import { CountQuery } from "../../../common/index";
export declare class BaseCount extends WhereBase {
    resultCount: number;
    query: CountQuery;
    protected onQueryFinished(): void;
    protected onTransactionCompleted_: () => void;
}
