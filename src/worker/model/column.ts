import { IColumnOption } from "../../common/index";

export class Column implements IColumnOption {
    name: string;
    autoIncrement: boolean;
    primaryKey: boolean;
    unique: boolean;
    notNull: boolean;
    dataType: string;
    default;
    multiEntry: boolean;
    enableSearch: boolean;
    keyPath: string[];

    constructor(key: Column) {
        this.name = key.name;
        this.autoIncrement = key.autoIncrement != null ? key.autoIncrement : false;
        this.primaryKey = key.primaryKey != null ? key.primaryKey : false;
        this.unique = key.unique != null ? key.unique : false;
        this.notNull = key.notNull != null ? key.notNull : false;
        this.dataType = key.dataType != null ? key.dataType : (key.autoIncrement ? 'number' : null);
        this.default = key.default;
        this.multiEntry = key.multiEntry == null ? false : key.multiEntry;
        this.enableSearch = key.enableSearch == null ? true : key.enableSearch;
        this.keyPath = key.keyPath;
    }

}