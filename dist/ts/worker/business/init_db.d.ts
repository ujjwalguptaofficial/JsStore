import { TableHelper } from "../model/index";
import { IError } from "../../common/index";
import { BaseDb } from "./base_db";
export declare class InitDb extends BaseDb {
    onSuccess: (isDbCreated: boolean) => void;
    constructor(onSuccess: (isDbCreated: boolean) => void, onError: (err: IError) => void);
    execute(tablesMetaData: TableHelper[]): void;
    private savedbNameIntoDbList_;
    private setPrimaryKey_;
}
