
module JsStore {

    export module Model {

        export interface ITable {
            Name: string;
            Columns: Array<IColumn>;
            Version: number;
        }

        export class Table implements ITable {
            Name: string = "";
            Columns: Array<Column> = [];
            Version: number;
            //internal Members
            RequireDelete: boolean = false;
            RequireCreation: boolean = false;
            PrimaryKey: string = "";

            constructor(table: ITable, dbName: string) {
                this.Name = table.Name;
                this.Version = table.Version == undefined ? 1 : table.Version;
                var That = this;
                table.Columns.forEach(function (item) {
                    That.Columns.push(new Column(item, table.Name));
                })

                this.setRequireDelete(dbName);
                this.setDbVersion(dbName);
                this.setPrimaryKey(dbName);
            }

            //private methods

            private setPrimaryKey(dbName) {
                var That = this;
                this.Columns.forEach(function (item) {
                    if (item.PrimaryKey) {
                        That.PrimaryKey = item.Name;
                    }
                })

            }

            private setRequireDelete(dbName: string) {
                var That = this;
                KeyStore.get("JsStore_" + dbName + "_" + this.Name + "_Version", function (tableVersion) {
                    if (tableVersion == null) {
                        That.RequireCreation = true;
                    }
                    else if (tableVersion != That.Version) {
                        That.RequireDelete = true;
                    }
                });

            }

            private setDbVersion(dbName: string) {
                var That = this;
                KeyStore.get('JsStore_' + dbName + '_Db_Version', function (dbVersion) {
                    dbVersion = dbVersion ? dbVersion : That.Version;
                    //setting db version
                    KeyStore.set('JsStore_' + dbName + '_Db_Version', dbVersion);
                    //setting table version
                    KeyStore.set("JsStore_" + dbName + "_" + That.Name + "_Version", dbVersion);

                });
            }

        }
    }
}

