import { BaseSelect } from "./base_select";
import { SelectJoinQuery, TableJoinQuery } from "../../types";
import { IError } from "../../interfaces";
export declare class Join extends BaseSelect {
    query: SelectJoinQuery;
    queryStack: TableJoinQuery[];
    currentQueryStackIndex: number;
    constructor(query: SelectJoinQuery, onSuccess: (results: any[]) => void, onError: (err: IError) => void);
    private onTransactionCompleted_;
    private executeWhereJoinLogic_;
    private executeRightJoin_;
    private executeWhereUndefinedLogicForJoin_;
    private startExecutionJoinLogic_;
}
