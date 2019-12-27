import { Table } from "../../model/table";
export declare class SchemaChecker {
    table: Table;
    constructor(table: Table);
    check(setValue: object, tblName: string): import("../../../common/interfaces").IError;
    private checkByColumn_;
}
