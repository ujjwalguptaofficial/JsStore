import { Base } from "../base";
import { IUpdate } from "../../interfaces";
export declare const updateValue: (suppliedValue: any, storedValue: any) => any;
export declare class BaseUpdate extends Base {
    query: IUpdate;
    protected initTransaction(): void;
    protected onQueryFinished(): void;
    private onTransactionCompleted_;
}
