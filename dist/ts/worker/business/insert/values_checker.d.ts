import { Table } from "../../model/index";
import { ValueChecker } from "./value_checker";
export declare class ValuesChecker {
    table: Table;
    values: object[];
    valueCheckerObj: ValueChecker;
    constructor(table: Table, values: object[]);
    checkAndModifyValues(): Promise<{}>;
    private startChecking;
}
