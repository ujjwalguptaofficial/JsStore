import { Base } from "../base";
import { IInsert, IError } from "../../interfaces";
import { Table } from "../../model/table";
export declare class Instance extends Base {
    private valuesAffected_;
    query: IInsert;
    table: Table;
    constructor(query: IInsert, onSuccess: (rowsInserted: number) => void, onError: (err: IError) => void);
    execute(): void;
    private onTransactionCompleted_;
    private onQueryFinished_;
    private insertData_;
}
