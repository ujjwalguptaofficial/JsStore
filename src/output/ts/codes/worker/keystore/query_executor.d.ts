import { IDbStatus, IQueryResult, IQueryRequest } from "./interfaces";
export declare class QueryExecutor {
    static requestQueue: IQueryRequest[];
    static tableName: string;
    static columnName: string;
    static isCodeExecuting: boolean;
    static dbStatus: IDbStatus;
    static prcoessQuery(request: IQueryRequest): void;
    static executeCode(): void;
    static onQueryFinished(message: IQueryResult): void;
}
