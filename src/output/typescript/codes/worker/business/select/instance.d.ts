import { ISelect, IError } from "../../interfaces";
import { Helper } from "./helper";
export declare class Instance extends Helper {
    constructor(query: ISelect, onSuccess: (results: object[]) => void, onError: (err: IError) => void);
    execute(): void;
    private processWhereArrayQry();
    protected onQueryFinished(): void;
    private initTransaction_();
    private processWhere_();
    private onTransactionCompleted_;
    private orQueryFinish_();
    private orQuerySuccess_();
    private processOrLogic_();
}
