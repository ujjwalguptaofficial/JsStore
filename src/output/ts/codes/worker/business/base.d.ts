import { BaseHelper } from "./base_helper";
import { IError } from "../interfaces";
import { WhereChecker } from "./where_checker";
import { Column } from "../model/column";
export declare class Base extends BaseHelper {
    error: IError;
    errorOccured: boolean;
    errorCount: number;
    rowAffected: number;
    onSuccess: (result?) => void;
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
    protected onCursorError: (e: any) => void;
    protected onErrorOccured(e: any, customError?: boolean): void;
    protected onExceptionOccured(ex: DOMException, info: any): void;
    protected getColumnInfo(columnName: any): Column;
    protected addGreatAndLessToNotOp(): void;
    protected goToWhereLogic: () => void;
    protected makeQryInCaseSensitive(qry: any): any;
}
