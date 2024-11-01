import { DbMeta, TableMeta } from "@worker/model";
import { IDB_MODE, QUERY_OPTION, promise, forObj, IColumn, IDataBase, InitDbResult } from "@/common";
import { LogHelper, userDbSchema } from "@worker/utils";
import { MetaHelper } from "../meta_helper";


export class IDBUtil {

    db: DbMeta;

    con: IDBDatabase;
    tx: IDBTransaction;

    logger = new LogHelper(null);

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

    initDb(db: DbMeta) {
        let isDbCreated = false;
        const dbVersion = db.version;
        let oldVersion;
        const initLogic = (res, rej) => {
            const dbOpenRequest = indexedDB.open(db.name, dbVersion);
            dbOpenRequest.onsuccess = () => {
                this.con = dbOpenRequest.result;
                this.con.onversionchange = (e: any) => {
                    // if (e.newVersion === null) { // An attempt is made to delete the db
                    e.target.close(); // Manually close our connection to the db
                    // }
                }

                res({
                    isCreated: isDbCreated,
                    oldVersion: oldVersion,
                    newVersion: dbVersion
                } as InitDbResult);
            }

            dbOpenRequest.onerror = (e) => {
                console.error("error", e);
                rej(e);
            };

            dbOpenRequest.onupgradeneeded = (e: IDBVersionChangeEvent) => {
                oldVersion = e.oldVersion;
                const target: {
                    result: IDBDatabase,
                    transaction: IDBTransaction
                } = (e as any).target
                const upgradeConnection = target.result;
                isDbCreated = true;
                const transaction = target.transaction;
                const storeNames = upgradeConnection.objectStoreNames;
                const createObjectStore = (table: TableMeta) => {
                    console.log("table primary key", table.name, table.primaryKey);
                    const option: IDBObjectStoreParameters = table.primaryKey ? {
                        keyPath: table.columns.find(q => q.name === table.primaryKey).keyPath ||
                            table.primaryKey
                    } : {
                        autoIncrement: true
                    }

                    const store = upgradeConnection.createObjectStore(table.name, option);
                    table.columns.forEach(column => {
                        addColumn(store, column)
                    });
                }
                const addColumn = (store: IDBObjectStore, column: IColumn) => {
                    const columnName = column.name;
                    if (column.enableSearch && !store.indexNames.contains(columnName)) {
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
                        return createObjectStore(table);
                    }
                    const store = transaction.objectStore(table.name);
                    for (let i = oldVersion + 1; i <= dbVersion; i++) {
                        const alterQuery = table.alter[i];
                        if (alterQuery) {
                            if (alterQuery.add) {
                                const newColumns = table.setColumn(alterQuery.add);
                                newColumns.forEach(column => {
                                    addColumn(store, column);
                                    table.columns.push(column);
                                })
                            }
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
                                    newColumn.name = columnName;
                                    if (shouldDelete) {
                                        deleteColumn(store, table, columnName);
                                        addColumn(store, newColumn);
                                        table.columns.push(newColumn);
                                    }
                                })
                            )
                        }
                    }
                });

                for (let i = 0, length = storeNames.length; i < length; i++) {
                    const storeName = storeNames.item(i);
                    const tableIndex = db.tables.findIndex(qry => qry.name === storeName);
                    if (tableIndex < 0) {
                        upgradeConnection.deleteObjectStore(storeName);
                    }
                }

            }
        }
        return promise<InitDbResult>(initLogic)
    }
}
