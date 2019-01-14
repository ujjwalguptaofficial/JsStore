import { SelectQuery } from "../../types";
import { Helper } from "./helper";
import { IError } from "../../interfaces";
export declare class Instance extends Helper {
    constructor(query: SelectQuery, onSuccess: (results: object[]) => void, onError: (err: IError) => void);
    execute(): void;
    private processWhereArrayQry;
    protected onQueryFinished(): void;
    private initTransaction_;
    private processWhere_;
    private onTransactionCompleted_;
    private orQueryFinish_;
    private orQuerySuccess_;
    private processOrLogic_;
}
