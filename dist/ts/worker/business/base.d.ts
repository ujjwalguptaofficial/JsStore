import { BaseHelper } from "./base_helper";
import { IError } from "../interfaces";
import { WhereChecker } from "./where_checker";
import { Column } from "../model/index";
export declare class Base extends BaseHelper {
    error: IError;
    rowAffected: number;
    onSuccess: (result?: any) => void;
    onError: (err: IError) => void;
    objectStore: IDBObjectStore;
    query: any;
    whereCheckerInstance: WhereChecker;
    tableName: string;
    isTransaction: boolean;
    cursorOpenRequest: IDBRequest;
    checkFlag: boolean;
    skipRecord: any;
    limitRecord: any;
    protected onErrorOccured(e: any, customError?: boolean): void;
    protected onExceptionOccured(ex: DOMException, info: any): void;
    protected getColumnInfo(columnName: any): Column;
    protected goToWhereLogic: () => void;
    protected makeQryInCaseSensitive(qry: any): any;
}
