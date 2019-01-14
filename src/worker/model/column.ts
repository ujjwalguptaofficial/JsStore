
import { LogHelper } from "../log_helper";
import { ERROR_TYPE } from "../enums";
import { IColumn } from "../interfaces";

export class Column implements IColumn {
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

    constructor(key: IColumn, tableName: string) {
        if (key.name != null) {
            this.name = key.name;
        }
        else {
            const err = new LogHelper(ERROR_TYPE.UndefinedColumnName, { TableName: tableName });
            err.throw();
        }
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