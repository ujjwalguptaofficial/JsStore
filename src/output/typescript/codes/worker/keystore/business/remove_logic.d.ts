import { Base } from "./base_logic";
import { IError } from "../interfaces";
export declare class Remove extends Base {
    key: string;
    rowAffected: number;
    constructor(key: string, onSuccess: (recordRemoved: number) => void, onError: (err: IError) => void);
    execute(): void;
    private initTransaction();
    private onTransactionCompleted();
}
