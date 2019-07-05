import { Table } from "../../model/index";
import { LogHelper } from "../../log_helper";
export declare class ValueChecker {
    table: Table;
    value: object;
    errorOccured: boolean;
    log: LogHelper;
    autoIncrementValue: {};
    constructor(table: Table, autoIncrementValue: any);
    checkAndModifyValue(value: any): boolean;
    private checkNotNullAndDataType_;
    private checkAndModifyColumnValue_;
    private onValidationError_;
}
