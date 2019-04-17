import { Base } from "../base";
import { InsertQuery } from "../../types";
import { Table } from "../../model/index";
import { IError } from "../../interfaces";
export declare class Instance extends Base {
    private valuesAffected_;
    query: InsertQuery;
    table: Table;
    constructor(query: InsertQuery, onSuccess: (rowsInserted: number) => void, onError: (err: IError) => void);
    execute(): void;
    private onTransactionCompleted_;
    private onQueryFinished_;
    private insertData_;
}
