import { Table } from "../../model/table";
import { ValueChecker } from "./value_checker";
export declare class ValuesChecker {
    table: Table;
    values: object[];
    valueCheckerObj: ValueChecker;
    constructor(table: Table, values: object[]);
    checkAndModifyValues(): Promise<{}>;
    private startChecking;
}
