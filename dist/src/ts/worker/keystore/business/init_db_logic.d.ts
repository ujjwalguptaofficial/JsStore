import { IError } from "../interfaces";
export declare let tempDatas: any;
export declare class InitDb {
    constructor(dbName: string, onSuccess: () => void, onError: (err: IError) => void);
}
