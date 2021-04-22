import { IDataBase } from "@/main";
import { promise } from "@/common";
import { DbMeta } from "../model";
import { TABLE_STATE } from "../enums";
import { TableMeta } from "../model/table_meta";
import { MetaHelper } from "../meta_helper";

export class InitDb {

    db: DbMeta;

    constructor(db: DbMeta) {
        db.version = db.version || 1;
        this.db = db;
    }

    execute() {
        interface IDbResult {
            isCreated: Boolean;
            con: IDBDatabase
        }
        const db = this.db;
        let isDbCreated = false;
        const initLogic = (res, rej) => {
            const dbOpenRequest = indexedDB.open(db.name, db.version);
            const metaValues: { key: string, value: any }[] = [{
                key: MetaHelper.dbSchema(),
                value: db
            }];
            dbOpenRequest.onsuccess = function () {
                const con = dbOpenRequest.result;
                if (isDbCreated) {
                    // insert meta values into 
                }
                res({
                    isCreated: isDbCreated,
                    con: con
                } as IDbResult);
            }

            dbOpenRequest.onerror = rej;

            dbOpenRequest.onupgradeneeded = function (e) {
                const upgradeConnection: IDBDatabase = (e as any).target.result;
                isDbCreated = true;
                const createObjectStore = (table: TableMeta) => {
                    const option: IDBObjectStoreParameters = table.primaryKey ? {
                        keyPath: table.primaryKey
                    } : {
                            autoIncrement: true
                        }
                    const store = upgradeConnection.createObjectStore(table.name, option);
                    for (const columnName in table.columns) {
                        const column = table.columns[columnName];
                        if (column.enableSearch) {
                            const options = column.primaryKey ? { unique: true } : { unique: column.unique };
                            options['multiEntry'] = column.multiEntry;
                            const keyPath = column.keyPath == null ? columnName : column.keyPath;
                            store.createIndex(columnName, keyPath, options);
                            if (column.autoIncrement) {
                                metaValues.push({
                                    key: MetaHelper.autoIncrementKey(table.name, columnName),
                                    value: 0
                                });
                            }
                        }
                    }
                }
                db.tables.forEach(table => {
                    if (table.state === TABLE_STATE.Create) {
                        createObjectStore(table);
                    }
                    else if (table.state === TABLE_STATE.Delete) {
                        // Delete the old datastore.    
                        if (upgradeConnection.objectStoreNames.contains(table.name)) {
                            upgradeConnection.deleteObjectStore(table.name);
                        }
                        createObjectStore(table);
                    }
                });
            }
        }
        return promise<IDbResult>(initLogic)
    }
}