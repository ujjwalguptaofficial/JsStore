import { API } from "../enums";
import { IError } from "../interfaces";
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
    checkAndModify(): Promise<{}>;
    private isInsertQryValid_;
    private checkBulkInsert_;
    private checkInsertQuery_;
    private checkUpdateQuery_;
    private checkFetchQuery_;
    private isTableExist_;
    private readonly activeDb_;
    private getTable_;
    private addGreatAndLessToNotOp_;
    private getType_;
}
