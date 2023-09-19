import { DbMeta } from "@worker/model";
import { IDataBase, ITable } from "@/common";

export const userDbSchema = (db: DbMeta) => {
    if (db == null) {
        throw new Error(`userDbSchema db is null`);
    }
    const database = {
        name: db.name,
        version: db.version,
        tables: []
    } as IDataBase;
    db.tables.forEach(table => {
        const tableAsObj = {
            name: table.name,
            columns: {}
        } as ITable;
        table.columns.forEach(column => {
            tableAsObj.columns[column.name] = column;
        });
        database.tables.push(tableAsObj);
    })
    return database;
}