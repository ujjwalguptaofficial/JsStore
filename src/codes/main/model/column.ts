import { IColumn } from "../interfaces";
import { DATA_TYPE, COL_OPTION } from "../enums";

export class Column implements IColumn {
    name: string;
    primaryKey: boolean;
    autoIncrement: boolean;
    unique: boolean;
    notNull: boolean;
    dataType: string;
    default: any;
    multiEntry: boolean;
    enableSearch: boolean;

    constructor(name: string) {
        this.name = name;
    }

    options(columnOptions: COL_OPTION[]) {
        columnOptions.forEach(option => {
            switch (option) {
                case COL_OPTION.AutoIncrement:
                    this.autoIncrement = true;
                    break;
                case COL_OPTION.MultiEntry:
                    this.multiEntry = true;
                    break;
                case COL_OPTION.NotNull:
                    this.notNull = true;
                    break;
                case COL_OPTION.PrimaryKey:
                    this.primaryKey = true;
                    break;
                case COL_OPTION.Unique:
                    this.unique = true;
                    break;
            }
        });
        return this;
    }

    setDataType(type: DATA_TYPE) {
        this.dataType = type; return this;
    }

    setDefault(value) {
        this.default = value; return this;
    }

    disableSearch() {
        this.enableSearch = false;
        return this;
    }
}