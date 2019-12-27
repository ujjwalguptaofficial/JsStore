import { Base } from "../base";
import { UpdateQuery } from "../../../common/index";
export declare const updateValue: (suppliedValue: any, storedValue: any) => any;
export declare class BaseUpdate extends Base {
    query: UpdateQuery;
    protected initTransaction(): void;
    protected onQueryFinished(): void;
    private onTransactionCompleted_;
}
