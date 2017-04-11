module JsStorage {
    export module Model {
        export interface ITable {
            Name: string;
            Columns: Array<IColumn>;
            Version: number;
        }
        export class Table {
            Name: string = "";
            Columns: Array<Column> = [];
            Version: number;

            //internal Members
            RequireDelete: boolean = false;
            RequireCreation: boolean = false;
            PrimaryKey: string = "";

            constructor(table: ITable, dbName: string) {
                this.Name = table.Name.toLowerCase();
                this.Version = table.Version == undefined ? 1 : table.Version;
                var That = this;
                table.Columns.forEach(function (item) {
                    That.Columns.push(new Column(item, table.Name));
                })

                this.setRequireDelete(dbName);
                this.setDbVersion(dbName);
                this.setPrimaryKey();
            }

            //private methods

            private setPrimaryKey() {
                //this.Key = new Column();//
                var That = this,
                    Length = this.Columns.length;
                this.Columns.forEach(function (item, index) {
                    if (item.PrimaryKey && That.PrimaryKey.length == 0) {
                        That.PrimaryKey = item.Name;
                        localStorage.setItem("JsStorage_" + That.Name + "_" + item.Name, "true");
                    }
                    else if (item.PrimaryKey && That.PrimaryKey.length > 0) {
                        localStorage.setItem("JsStorage_" + That.Name + "_" + item.Name, "");
                        throw "Multiple primary key are not allowed";
                    }
                    // else if (index == Length && That.PrimaryKey.length == 0) {

                    // }
                })

            }

            private setRequireDelete(dbName: string) {
                var TableVersion = localStorage.getItem("JsStorage_" + dbName + "_" + this.Name);
                if (TableVersion == null || localStorage.getItem('JsStorage_Db_Version') == null) {
                    this.RequireCreation = true;
                }
                else if (TableVersion != this.Version.toString()) {
                    this.RequireDelete = true;
                }
                this.Version = this.Version == null ? 1 : this.Version;

            }

            private setDbVersion(dbName: string) {
                if (this.Version == null) {
                    localStorage.setItem(dbName + 'Db_Version', '1');
                }
                else if (this.Version > Number(localStorage.getItem(dbName + 'Db_Version'))) {
                    localStorage.setItem(dbName + 'Db_Version', this.Version.toString());
                }
            }

        }
    }
}