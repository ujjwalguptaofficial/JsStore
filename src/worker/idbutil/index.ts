import { DbMeta } from "@worker/model";
import { TABLE_STATE } from "@worker/enums";
import { TableMeta } from "@worker/model/table_meta";
import { IDB_MODE, QUERY_OPTION, promise } from "@/common";

export class IDBUtil {

    db: DbMeta;

    con: IDBDatabase;
    tx: IDBTransaction;

    constructor(db: DbMeta) {
        this.db = db;
    }

    emptyTx() {
        if (!this.tx) return;
        this.tx.oncomplete = null;
        this.tx.onabort = null;
        this.tx.onerror = null;
        this.tx = null;
    }
    createTransaction(tables: string[], mode = IDB_MODE.ReadWrite) {
        this.tx = this.con.transaction(tables, mode);
        return promise((res, rej) => {
            this.tx.oncomplete = res;
            this.tx.onabort = res;
            this.tx.onerror = rej;
        });
    }

    keyRange(value, op?) {
        let keyRange: IDBKeyRange;
        switch (op) {
            case QUERY_OPTION.Between: keyRange = IDBKeyRange.bound(value.low, value.high, false, false); break;
            case QUERY_OPTION.GreaterThan: keyRange = IDBKeyRange.lowerBound(value, true); break;
            case QUERY_OPTION.GreaterThanEqualTo: keyRange = IDBKeyRange.lowerBound(value); break;
            case QUERY_OPTION.LessThan: keyRange = IDBKeyRange.upperBound(value, true); break;
            case QUERY_OPTION.LessThanEqualTo: keyRange = IDBKeyRange.upperBound(value); break;
            default: keyRange = IDBKeyRange.only(value); break;
        }
        return keyRange;
    }

    objectStore(name: string) {
        return this.tx.objectStore(name);
    }

    abortTransaction() {
        if (this.tx) {
            this.tx.abort();
        }
    }

    close() {
        this.con.close();
        // wait for 100 ms before success
        return promise(res => {
            this.con = null;
            setTimeout(res, 100);
        });
    }

    initDb() {

        const db = this.db;
        let isDbCreated = false;
        const initLogic = (res, rej) => {
            const dbOpenRequest = indexedDB.open(db.name, db.version);

            dbOpenRequest.onsuccess = () => {
                this.con = dbOpenRequest.result;
                this.con.onversionchange = (e: any) => {
                    // if (e.newVersion === null) { // An attempt is made to delete the db
                    e.target.close(); // Manually close our connection to the db
                    // }
                }
                res(isDbCreated);
            }

            dbOpenRequest.onerror = (e) => {
                debugger;
                console.log("error", e);
                rej(e);
            };

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
                    table.columns.forEach(column => {
                        if (column.enableSearch) {
                            const columnName = column.name;
                            const options = column.primaryKey ? { unique: true } : { unique: column.unique };
                            options['multiEntry'] = column.multiEntry;
                            const keyPath = column.keyPath == null ? columnName : column.keyPath;
                            store.createIndex(columnName, keyPath, options);
                        }
                    });
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
        return promise<boolean>(initLogic)
    }
}