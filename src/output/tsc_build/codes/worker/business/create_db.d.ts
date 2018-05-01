import { TableHelper } from "../model/table_helper";
import { IError } from "../interfaces";
export declare class CreateDb {
    private dbName_;
    private readonly activeDb_;
    private readonly dbVersion_;
    private dbStatus_;
    private dbConnection_;
    private getDbList_(callback);
    constructor(tablesMetaData: TableHelper[], onSuccess: (listOf) => void, onError: (err: IError) => void);
    private saveDbName_();
}
