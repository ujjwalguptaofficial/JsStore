import { SelectQuery, IError } from "../../../common/index";
import { Join } from "./join";
export declare class Instance extends Join {
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
