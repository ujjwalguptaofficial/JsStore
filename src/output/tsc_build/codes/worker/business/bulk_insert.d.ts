import { Base } from "./base";
import { IInsert, IError } from "../interfaces";
export declare class BulkInsert extends Base {
    query: IInsert;
    constructor(query: IInsert, onSuccess: () => void, onError: (err: IError) => void);
    execute(): void;
    private bulkinsertData(values);
}
