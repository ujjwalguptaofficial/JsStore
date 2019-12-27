import { Where } from "./where";
import { RemoveQuery, IError } from "../../../common/index";
export declare class Instance extends Where {
    constructor(query: RemoveQuery, onSuccess: (recordRemoved: number) => void, onError: (err: IError) => void);
    execute(): void;
    private processWhereArrayQry;
    private processWhere_;
    private initTransaction_;
    private onTransactionCompleted_;
    protected onQueryFinished(): void;
    private orQuerySuccess_;
    private processOrLogic;
}
