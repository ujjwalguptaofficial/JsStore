import { BaseHelper } from "./base_helper";
import { IError } from "../../common/index";
import { WhereChecker } from "./where_checker";
import { Column } from "../model/index";
export declare abstract class Base extends BaseHelper {
    error: IError;
    rowAffected: number;
    onSuccess: (result?: any) => void;
    onError: (err: IError) => void;
    objectStore: IDBObjectStore;
    query: any;
    whereCheckerInstance: WhereChecker;
    tableName: string;
    isTransaction: boolean;
    skipRecord: any;
    limitRecord: any;
    protected onErrorOccured(e: any, customError?: boolean): void;
    protected onExceptionOccured(ex: DOMException): void;
    protected getColumnInfo(columnName: string, tableName: string): Column;
    private getRegexFromLikeExpression_;
    protected goToWhereLogic(): void;
    protected makeQryInCaseSensitive(whereQry: any): any;
}
