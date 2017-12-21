
namespace JsStore {

    export namespace Model {

        export interface ITable {
            Name: string;
            Columns: IColumn[];
            Version: number;
        }

        export class Table {
            _name: string = "";
            _columns: IColumn[];
            _version: number;

            // internal Members
            _requireDelete: boolean = false;
            _requireCreation: boolean = false;
            _primaryKey: string = "";

            constructor(table: ITable, dbName: string) {
                this._name = table.Name;
                this._version = table.Version == null ? 1 : table.Version;
                table.Columns.forEach(function (item) {
                    this.Columns.push(new Column(item, table.Name));
                }, this);

                this.setRequireDelete(dbName);
                this.setDbVersion(dbName);
                this.setPrimaryKey(dbName);
            }

            private setPrimaryKey(dbName) {
                this._columns.forEach(function (item) {
                    if (item.PrimaryKey) {
                        this.PrimaryKey = item.Name;
                    }
                }, this);

            }

            private setRequireDelete(dbName: string) {
                var that = this;
                KeyStore.get("JsStore_" + dbName + "_" + this._name + "_Version", function (tableVersion) {
                    if (tableVersion == null) {
                        that._requireCreation = true;
                    }
                    // mark only table which has version greater than store version
                    else if (tableVersion < that._version) {
                        that._requireDelete = true;
                    }
                });
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

