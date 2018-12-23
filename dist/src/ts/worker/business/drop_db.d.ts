import { IError } from "../interfaces";
import { BaseDb } from "./base_db";
export declare class DropDb extends BaseDb {
    private onSuccess_;
    private onError_;
    constructor(onSuccess: () => void, onError: (err: IError) => void);
    deleteMetaData(): void;
    deleteDb(): void;
}
