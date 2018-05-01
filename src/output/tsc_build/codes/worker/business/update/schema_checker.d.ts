import { Table } from "../../model/table";
import { IError } from "../../interfaces";
export declare class SchemaChecker {
    table: Table;
    constructor(table: Table);
    check(setValue: object, tblName: string): IError;
    private isNull_(value);
    private getType_(value);
    private checkByColumn_(column, value);
}
