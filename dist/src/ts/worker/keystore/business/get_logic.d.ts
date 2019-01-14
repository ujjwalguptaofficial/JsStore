import { Base } from "./base_logic";
import { IError } from "../interfaces";
export declare class Get extends Base {
    key: string;
    constructor(key: string, onSuccess: (result: any) => void, onError: (err: IError) => void);
    execute(): void;
    private initTransaction_;
    private onTransactionCompleted_;
}
