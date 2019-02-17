import { Table } from "./table";
import { Column } from "./column";
import { KeyStore } from "../keystore/index";
import { IdbHelper } from "../business/idb_helper";
import { promise } from "../business/helpers/promise";

export class TableHelper {
    name: string;
    columns: Column[] = [];

    // internal Members
    primaryKey: string;
    version: number;
    requireDelete = false;
    requireCreation = false;
    callback: (tableHelperObj: TableHelper) => void;

    constructor(table: Table) {
        this.name = table.name;
        this.version = table.version;
        this.columns = table.columns;
        this.setPrimaryKey_();
    }

    createMetaData(dbName: string): Promise<TableHelper> {
        return promise((resolve) => {
            this.callback = resolve;
            this.setRequireDelete_(dbName);
            this.setDbVersion_(dbName);
        });
    }

    private setPrimaryKey_() {
        this.columns.every((item) => {
            this.primaryKey = item.primaryKey ? item.name : "";
            return !item.primaryKey;
        });
    }

    private setRequireDelete_(dbName: string) {
        KeyStore.get<number>(`JsStore_${dbName}_${this.name}_Version`).then(tableVersion => {
            if (tableVersion == null) {
                this.requireCreation = true;
            }
            // mark only table which has version greater than store version
            else if (tableVersion < this.version) {
                this.requireDelete = true;
            }
        });
    }

    private setDbVersion_(dbName: string) {
        IdbHelper.activeDbVersion = IdbHelper.activeDbVersion > this.version ? IdbHelper.activeDbVersion : this.version;
        // setting db version
        KeyStore.set(`JsStore_${dbName}_Db_Version`, IdbHelper.activeDbVersion);
        // setting table version
        KeyStore.set(`JsStore_${dbName}_${this.name}_Version`, IdbHelper.activeDbVersion).then(() => {
            this.version = IdbHelper.activeDbVersion;
            this.callback(this);
        });
    }
}