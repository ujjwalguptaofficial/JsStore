import { Base } from "./base_logic";
import { IInsert, IError } from "../interfaces";
export declare class Set extends Base {
    query: IInsert;
    constructor(query: IInsert, onSuccess: (result: any) => void, onError: (err: IError) => void);
    execute(): void;
    private initTransaction;
    private onTransactionCompleted_;
}
