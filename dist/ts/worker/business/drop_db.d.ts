import { IError } from "../../common/index";
import { BaseDb } from "./base_db";
export declare class DropDb extends BaseDb {
    private onSuccess_;
    private onError_;
    constructor(onSuccess: () => void, onError: (err: IError) => void);
    deleteMetaData(): Promise<{}>;
    deleteDb(): void;
}
