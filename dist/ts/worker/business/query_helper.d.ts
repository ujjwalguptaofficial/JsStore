import { API, IError } from "../../common/index";
export declare class QueryHelper {
    api: API;
    query: any;
    error: IError;
    isTransaction: boolean;
    static autoIncrementValues: {
        [table: string]: {
            [columnName: string]: number;
        };
    };
    constructor(api: API, query: any);
    checkAndModify(): Promise<unknown>;
    private isInsertQryValid_;
    private checkInsertQuery_;
    private checkUpdateQuery_;
    private checkForNullInWhere_;
    private checkFetchQuery_;
    private isTableExist_;
    private get activeDb_();
    private getTable_;
    private addGreatAndLessToNotOp_;
}
