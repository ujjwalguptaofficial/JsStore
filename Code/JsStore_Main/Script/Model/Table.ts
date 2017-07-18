
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
                //this.Key = new Column();//
                var That = this,
                    Length = this.Columns.length;
                this.Columns.every(function (item) {
                    if (item.PrimaryKey) {
                        That.PrimaryKey = item.Name;
                        localStorage.setItem("JsStore_" + dbName + "_" + That.Name + "_" + item.Name, "true");
                        return false;
                    }
                    return true;
                })

            }

            private setRequireDelete(dbName: string) {
                var TableVersion = localStorage.getItem("JsStore_" + dbName + "_" + this.Name);
                if (TableVersion == null) {
                    this.RequireCreation = true;
                }
                else if (TableVersion != this.Version.toString()) {
                    this.RequireDelete = true;
                }
            }

            private setDbVersion(dbName: string) {
                var Version = this.Version.toString(),
                    DbVersion = Number(localStorage.getItem('JsStore_' + dbName + 'Db_Version'));
                if (this.Version > DbVersion) {
                    //setting db version
                    localStorage.setItem('JsStore_' + dbName + 'Db_Version', Version);
                }
                //setting table version
                localStorage.setItem("JsStore_" + dbName + "_" + this.Name, Version);
            }

        }
    }
}

