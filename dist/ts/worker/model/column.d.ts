import { IColumnOption } from "../../common/index";
export declare class Column implements IColumnOption {
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
    constructor(key: Column);
}
