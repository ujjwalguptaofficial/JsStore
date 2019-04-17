import { TableHelper } from "../model/index";
import { IError } from "../interfaces";
import { BaseDb } from "./base_db";
export declare class InitDb extends BaseDb {
    private isDbCreated_;
    constructor(onSuccess: (isDbCreated: boolean) => void, onError: (err: IError) => void);
    execute(tablesMetaData: TableHelper[]): Promise<{}>;
    private savedbNameIntoDbList_;
    private setPrimaryKey_;
}
