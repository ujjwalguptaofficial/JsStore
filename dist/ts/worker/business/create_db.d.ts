import { TableHelper } from "../model/table_helper";
import { IError } from "../interfaces";
import { BaseDb } from "./base_db";
export declare class CreateDb extends BaseDb {
    constructor(onSuccess: (listOf: any) => void, onError: (err: IError) => void);
    execute(tablesMetaData: TableHelper[]): void;
    private savedbNameIntoDbList_;
}
