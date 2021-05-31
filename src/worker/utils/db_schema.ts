import { DbMeta } from "@worker/model";
import { IDataBase, ITable } from "@/common";

export const userDbSchema = (db: DbMeta) => {
    const database = {
        name: db.name,
        version: db.version,
        tables: []
    } as IDataBase;
    db.tables.forEach(table => {
        const tableAsObj = {
            name: table.name,
            version: table.version,
            columns: {}
        } as ITable;
        table.columns.forEach(column => {
            tableAsObj.columns[column.name] = column;
        });
        database.tables.push(tableAsObj);
    })
    return database;
}