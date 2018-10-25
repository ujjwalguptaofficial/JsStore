import { IColumn } from "../interfaces";
import { DATA_TYPE, COL_OPTION } from "../enums";
export declare class Column implements IColumn {
    name: string;
    primaryKey: boolean;
    autoIncrement: boolean;
    unique: boolean;
    notNull: boolean;
    dataType: string;
    default: any;
    multiEntry: boolean;
    enableSearch: boolean;
    keyPath: string[];
    constructor(name: string);
    options(columnOptions: COL_OPTION[]): this;
    setDataType(type: DATA_TYPE): this;
    setDefault(value: any): this;
    disableSearch(): this;
}
