import { IColumn } from "../interfaces";
export declare class Column implements IColumn {
    name: string;
    autoIncrement: boolean;
    primaryKey: boolean;
    unique: boolean;
    notNull: boolean;
    dataType: string;
    default: any;
    multiEntry: boolean;
    enableSearch: boolean;
    keyPath: string[];
    constructor(key: IColumn, tableName: string);
}
