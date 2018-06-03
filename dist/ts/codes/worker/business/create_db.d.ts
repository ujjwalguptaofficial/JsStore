import { TableHelper } from "../model/table_helper";
import { IError } from "../interfaces";
import { BaseDb } from "./base_db";
export declare class CreateDb extends BaseDb {
    constructor(tablesMetaData: TableHelper[], onSuccess: (listOf) => void, onError: (err: IError) => void);
    private savedbNameIntoDbList();
}
