import { IQueryResult, IQueryRequest } from "./interfaces";
export declare class QueryExecutor {
    static requestQueue: IQueryRequest[];
    static tableName: string;
    static columnName: string;
    static isCodeExecuting: boolean;
    static prcoessQuery<T>(request: IQueryRequest): Promise<T>;
    static executeCode(): void;
    static onQueryFinished(message: IQueryResult): void;
}
