import { Table } from "../../model/table";
import { IError } from "../../interfaces";
import { ValueChecker } from "./value_checker";
export declare class ValuesChecker {
    table: Table;
    values: object[];
    error: IError;
    onFinish: (isError: boolean) => void;
    valueCheckerObj: ValueChecker;
    constructor(table: Table, values: object[]);
    checkAndModifyValues(onFinish: (isError: boolean) => void): void;
    private startChecking;
}
