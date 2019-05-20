
import { Column } from "./column";
import { ITable } from "../interfaces";
import { IColumn } from "../../main/index";
import { DATA_TYPE } from "../enums";

export class Table {
    name: string;
    columns: Column[] = [];
    version: number;
    primaryKey: string;

    constructor(table: ITable) {
        this.name = table.name;
        this.version = table.version == null ? 1 : table.version;
        for (const columnName in table.columns) {
            const column = {
                name: columnName
            } as IColumn;
            table.columns[columnName].forEach(function (item) {
                item = item.toLowerCase().replace(/\s/g, "");
                switch (item) {
                    case 'primarykey':
                        column.primaryKey = true;
                        break;
                    case 'autoincrement':
                        column.autoIncrement = true;
                        break;
                    case 'unique':
                        column.unique = true;
                        break;
                    case DATA_TYPE.Array:
                    case DATA_TYPE.Boolean:
                    case DATA_TYPE.DateTime:
                    case DATA_TYPE.Null:
                    case DATA_TYPE.Number:
                    case DATA_TYPE.String:
                    case DATA_TYPE.Object:
                        column.dataType = item;
                        break;
                    case 'enablesearch':
                        column.enableSearch = true; break;
                    case '!enableSearch':
                        column.enableSearch = false; break;
                    case 'keypath':
                        column.keyPath = item.split(',');
                        break;
                    case 'multiEntry':
                        column.multiEntry = true;
                        break;
                    default:
                        if (item.includes('default')) {
                            const splittedItem = item.split('=');
                            column.default = splittedItem[1];
                        }
                }
            });
            this.columns.push(new Column(column));
        }
    }
}