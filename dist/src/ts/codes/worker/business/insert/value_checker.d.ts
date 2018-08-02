import { Table } from "../../model/table";
import { LogHelper } from "../../log_helper";
export declare class ValueChecker {
    table: Table;
    value: object;
    errorOccured: boolean;
    log: LogHelper;
    autoIncrementValue: {};
    constructor(table: Table, autoIncrementValue: any);
    checkAndModifyValue(value: any): boolean;
    private isNull_(value);
    private getType_(value);
    private checkNotNullAndDataType_(column);
    private checkAndModifyColumnValue_(column);
    private onValidationError_(error, details);
}
