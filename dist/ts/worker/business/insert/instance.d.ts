import { Base } from "../base";
import { InsertQuery, IError } from "../../../common/index";
import { Table } from "../../model/index";
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
