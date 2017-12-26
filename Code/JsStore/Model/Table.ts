namespace JsStore {
    export namespace Model {
        export class Table {
            _name: string;
            _columns: Column[] = [];
            _version: number;

            // internal Members
            _requireDelete: boolean = false;
            _requireCreation: boolean = false;
            _primaryKey: string = "";

            constructor(table: ITableOption, dbName: string) {
                this._name = table.Name;
                this._version = table.Version == null ? 1 : table.Version;
                table.Columns.forEach(function (item) {
                    this._columns.push(new Column(item, table.Name));
                }, this);

                this.setRequireDelete(dbName);
                this.setDbVersion(dbName);
                this.setPrimaryKey(dbName);
            }

            private setPrimaryKey(dbName) {
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
                db_version = db_version > this._version ? db_version : this._version;
                // setting db version
                KeyStore.set('JsStore_' + dbName + '_Db_Version', db_version)
                    // setting table version
                    .set("JsStore_" + dbName + "_" + this._name + "_Version", db_version);
                this._version = db_version;
            }

        }
    }
}