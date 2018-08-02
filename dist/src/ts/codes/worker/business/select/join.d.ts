import { BaseSelect } from "./base_select";
import { ISelectJoin, ITableJoin, IError } from "../../interfaces";
export declare class Join extends BaseSelect {
    query: ISelectJoin;
    queryStack: ITableJoin[];
    currentQueryStackIndex: number;
    constructor(query: ISelectJoin, onSuccess: (results: any[]) => void, onError: (err: IError) => void);
    private onTransactionCompleted_(e);
    private executeWhereJoinLogic_(joinQuery, query);
    private executeRightJoin_(joinQuery, query);
    private executeWhereUndefinedLogicForJoin_(joinQuery, query);
    private startExecutionJoinLogic_();
}
