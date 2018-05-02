import { IError } from "../interfaces";
export declare class DropDb {
    private onSuccess_;
    private onError_;
    private dbName_;
    constructor(onSuccess: () => void, onError: (err: IError) => void);
    deleteMetaData(): void;
    private getDbList_(callback);
    deleteDb(): void;
}
