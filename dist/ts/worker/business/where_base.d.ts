import { Base } from "./base";
export declare class WhereBase extends Base {
    protected results: any[];
    protected skipCnt: number;
    protected passFilter: (value: any) => boolean;
    protected passAction: (value: any) => void;
    protected executeWhereOnColumn(column: any): void;
    protected didNotReachLimit(): boolean;
    protected pass(cursor: IDBCursorWithValue): boolean;
    protected skipOrPush: (value: any) => void;
    protected onQueryFinished(): void;
}
