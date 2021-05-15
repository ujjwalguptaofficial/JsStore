import { IDataBase } from "@/common";
import { TableMeta } from "./table_meta";
import { MetaHelper } from "@worker/meta_helper";

export class DbMeta {
    name: string;
    version: number;

    tables: TableMeta[];

    constructor(db: IDataBase) {
        this.name = db.name;
        db.tables.push({
            name: MetaHelper.tableName,
            columns: {
                key: {
                    primaryKey: true
                },
                value: {
                    enableSearch: false
                }
            }
        })
        this.tables = db.tables.map(table => {
            return new TableMeta(table, db.version);
        });
        this.version = db.version || 1;
    }
}