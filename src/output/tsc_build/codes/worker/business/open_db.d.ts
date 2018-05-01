import { IError } from "../interfaces";
export declare class OpenDb {
    private dbName_;
    private onSuccess_;
    private onError_;
    constructor(onSuccess: () => void, onError: (err: IError) => void);
    private readonly dbStatus_;
    private dbConnection_;
    private updateDbStatus_(status, err?);
    private onDbDroppedByBrowser_(deleteMetaData?);
    execute(): void;
    private readonly activeDb_;
    private setPrimaryKey_();
}
