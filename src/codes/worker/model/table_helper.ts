import { Table } from "./table";
import { Column } from "./column";
import * as KeyStore from "../keystore/index";
import { IdbHelper } from "../business/idb_helper";

export class TableHelper {
    _name: string;
    _columns: Column[] = [];

    // internal Members
    _primaryKey: string;
    _version: number;
    _requireDelete: boolean = false;
    _requireCreation: boolean = false;
    _callback: () => void;

    constructor(table: Table) {
        this._name = table._name;
        this._version = table._version;
        this._columns = table._columns;
        this.setPrimaryKey();
    }

    public createMetaData(dbName: string, callBack: () => void) {
        this._callback = callBack;
        this.setRequireDelete(dbName);
        this.setDbVersion(dbName);
    }

    private setPrimaryKey() {
        this._columns.every(function (item) {
            this._primaryKey = item._primaryKey ? item._name : "";
            return !item._primaryKey;
        }, this);
    }

    private setRequireDelete(dbName: string) {
        KeyStore.get("JsStore_" + dbName + "_" + this._name + "_Version", function (tableVersion) {
            if (tableVersion == null) {
                this._requireCreation = true;
            }
            // mark only table which has version greater than store version
            else if (tableVersion < this._version) {
                this._requireDelete = true;
            }
        }.bind(this));
    }

    private setDbVersion(dbName: string) {
        IdbHelper._dbVersion = IdbHelper._dbVersion > this._version ? IdbHelper._dbVersion : this._version;
        // setting db version
        KeyStore.set(`JsStore_${dbName}_Db_Version`, IdbHelper._dbVersion);
        // setting table version
        KeyStore.set(`JsStore_${dbName}_${this._name}_Version`, IdbHelper._dbVersion, this._callback);
        this._version = IdbHelper._dbVersion;
    }
}