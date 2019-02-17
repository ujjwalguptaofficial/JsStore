import { DataBase } from "./database";
import { TableHelper } from "./table_helper";
import { Table } from "./table";

export class DbHelper {
    dbName: string;
    tables: Table[] = [];

    constructor(dataBase: DataBase) {
        this.dbName = dataBase.name;
        this.tables = dataBase.tables;
    }

    createMetaData() {
        return Promise.all(
            this.tables.map((table) => {
                return new TableHelper(table).createMetaData(this.dbName);
            })
        );
        // const createMetaDataForTable = () => {
        //     if (index < this.tables.length) {
        //         const table: Table = this.tables[index];
        //         const tableHelperInstance: TableHelper = new TableHelper(table);
        //         tableHelperInstance.createMetaData(this.name, function () {
        //             tableHelperInstance.callback = null;
        //             tableHelperList.push(tableHelperInstance);
        //             createMetaDataForTable();
        //         });
        //         ++index;
        //     }
        //     else {
        //         callBack(tableHelperList);
        //     }
        // };
        // createMetaDataForTable();
    }
}