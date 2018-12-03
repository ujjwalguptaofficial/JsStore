import { Base } from "./base";
import { InsertQuery } from "../types";
import { IError } from "../interfaces";
export declare class BulkInsert extends Base {
    query: InsertQuery;
    constructor(query: InsertQuery, onSuccess: () => void, onError: (err: IError) => void);
    execute(): void;
    private bulkinsertData;
}
