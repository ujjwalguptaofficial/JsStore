import { DbMeta, TableMeta } from "@worker/model";
import { IDB_MODE, QUERY_OPTION, promise, forObj, IColumn } from "@/common";
import { LogHelper, getKeys } from "@worker/utils";
import { Insert } from "../executors/insert";

export class IDBUtil {

    db: DbMeta;

    con: IDBDatabase;
    tx: IDBTransaction;

    logger = new LogHelper(null);

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

    createTransactionIfNotExist(tables: string[], mode?: IDB_MODE) {
        if (!this.tx) {
            this.createTransaction(tables, mode);
        }
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
        if (this.con) {
            this.con.close();
        }
        // wait for 100 ms before success
        return promise(res => {
            this.con = null;
            setTimeout(res, 100);
        });
    }

    initDb() {

        const db = this.db;
        let isDbCreated = false;
        const version = db.version;
        const dbDeleted: {
            [tableName: string]: Array<IColumn>
        } = {};
        const initLogic = (res, rej) => {
            const dbOpenRequest = indexedDB.open(db.name, version);
            dbOpenRequest.onsuccess = () => {
                this.con = dbOpenRequest.result;
                this.con.onversionchange = (e: any) => {
                    // if (e.newVersion === null) { // An attempt is made to delete the db
                    e.target.close(); // Manually close our connection to the db
                    // }
                }
                // this.createTransaction(getKeys(dbDeleted));
                // forObj(dbDeleted, (tableName, columns) => {
                //     const objectStore = this.objectStore(tableName);
                //     objectStore.getAll()
                // })
                res(isDbCreated);
            }

            dbOpenRequest.onerror = (e) => {
                console.error("error", e);
                rej(e);
            };

            dbOpenRequest.onupgradeneeded = (e: IDBVersionChangeEvent) => {
                const target: {
                    result: IDBDatabase,
                    transaction: IDBTransaction
                } = (e as any).target
                const upgradeConnection = target.result;
                isDbCreated = true;
                const transaction = target.transaction;
                const storeNames = upgradeConnection.objectStoreNames;
                const createObjectStore = (table: TableMeta) => {
                    const option: IDBObjectStoreParameters = table.primaryKey ? {
                        keyPath: table.primaryKey
                    } : {
                            autoIncrement: true
                        }

                    const store = upgradeConnection.createObjectStore(table.name, option);
                    table.columns.forEach(column => {
                        addColumn(store, column)
                    });
                }
                const addColumn = (store: IDBObjectStore, column: IColumn) => {
                    if (column.enableSearch) {
                        const columnName = column.name;
                        const options = column.primaryKey ? { unique: true } : { unique: column.unique };
                        options['multiEntry'] = column.multiEntry;
                        const keyPath = column.keyPath == null ? columnName : column.keyPath;
                        store.createIndex(columnName, keyPath, options);
                    }
                }
                const deleteColumn = (store: IDBObjectStore, table: TableMeta, columnName: string) => {
                    const index = table.columns.findIndex(q => q.name === columnName);
                    if (index >= 0) {
                        table.columns.splice(index, 1);
                        store.deleteIndex(columnName);
                    }
                }
                db.tables.forEach(table => {
                    if (!storeNames.contains(table.name)) {
                        createObjectStore(table);
                    }
                    const alterQuery = table.alter[version];
                    if (!alterQuery) return;
                    const store = transaction.objectStore(table.name);
                    forObj(
                        alterQuery.add || {}, ((_, column) => {
                            addColumn(store, column);
                            table.columns.push(column);
                        })
                    )
                    forObj(
                        alterQuery.drop || {}, ((columnName) => {
                            deleteColumn(store, table, columnName);
                        })
                    )
                    forObj(
                        alterQuery.modify || {}, ((columnName, column: IColumn) => {
                            const shouldDelete = column.multiEntry || column.keyPath || column.unique;
                            let targetColumn = table.columns.find(q => q.name === columnName);
                            const newColumn = Object.assign(targetColumn, column);
                            if (shouldDelete) {
                                deleteColumn(store, table, columnName);
                                addColumn(store, newColumn);
                                table.columns.push(newColumn);
                            }
                        })
                    )
                });
            }
        }
        return promise<boolean>(initLogic)
    }
}