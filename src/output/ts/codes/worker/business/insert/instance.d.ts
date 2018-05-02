import { Base } from "../base";
import { IInsert, IError } from "../../interfaces";
import { Table } from "../../model/table";
export declare class Instance extends Base {
    _valuesAffected: any[];
    query: IInsert;
    _table: Table;
    constructor(query: IInsert, onSuccess: (rowsInserted: number) => void, onError: (err: IError) => void);
    execute(): void;
    private onTransactionCompleted_;
    private onQueryFinished();
    private insertData(values);
}
