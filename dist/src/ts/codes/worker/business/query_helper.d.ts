import { API } from "../enums";
import { IError } from "../interfaces";
export declare class QueryHelper {
    api: API;
    query: any;
    error: IError;
    constructor(api: API, query: any);
    checkAndModify(): Promise<{}>;
    private isInsertQryValid_();
    private checkBulkInsert_();
    private checkInsertQuery_(onFinish);
    private checkUpdateQuery_();
    private checkFetchQuery_();
    private isTableExist_(tableName);
    private readonly activeDb_;
    private getTable_(tableName);
    private addGreatAndLessToNotOp_();
    private getType_(value);
    private isArray_(value);
}
