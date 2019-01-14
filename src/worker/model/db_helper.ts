import { DataBase } from "./database";
import { TableHelper } from "./table_helper";
import { Table } from "./table";

export class DbHelper {
    name: string;
    tables: Table[] = [];

    constructor(dataBase: DataBase) {
        this.name = dataBase.name;
        this.tables = dataBase.tables;
    }

    createMetaData(callBack: (tablesMetaData: TableHelper[]) => void) {
        let index = 0;
        const tableHelperList: TableHelper[] = [];
        const createMetaDataForTable = () => {
            if (index < this.tables.length) {
                const table: Table = this.tables[index],
                    tableHelperInstance: TableHelper = new TableHelper(table);
                tableHelperInstance.createMetaData(this.name, () => {
                    tableHelperInstance.callback = null;
                    tableHelperList.push(tableHelperInstance);
                    createMetaDataForTable();
                });
                ++index;
            }
            else {
                callBack(tableHelperList);
            }
        };
        createMetaDataForTable();
    }
}