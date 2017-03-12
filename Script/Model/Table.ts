module JsStorage {
    export module Model {

        export class Table {
            Name: string = "";
            Columns: Array<Column> = [];
            Version: number;
            RequireDelete: boolean = false;
            RequireCreation: boolean = false;
            PrimaryKey: string = "";

            //public methods
            constructor(name: string, columns: Array<IColumn>, version: number) {
                this.Name = name;
                var That = this;
                columns.forEach(function (item) {
                    That.Columns.push(new Column(item));
                })

                this.setRequireDelete();
                this.setDbVersion(version);
                this.setPrimaryKey();
            }

            //private methods

            private setPrimaryKey() {
                //this.Key = new Column();//
                var That = this;
                this.Columns.forEach(function (item) {
                    if (item.Primarykey && That.PrimaryKey.length == 0) {
                        That.PrimaryKey = item.Name;
                    }
                    else if (item.Primarykey && That.PrimaryKey.length > 0) {
                        throw "Multiple primary key are not allowed";
                    }
                })

            }

            private setRequireDelete() {
                var TableVersion = localStorage.getItem("JsStorage_" + this.Name);
                if (TableVersion == null || localStorage.getItem('JsStorage_Db_Version') == null) {
                    this.RequireCreation = true;
                }
                else if (TableVersion != this.Version.toString()) {
                    this.RequireDelete = true;
                }
                this.Version = this.Version == null ? 1 : this.Version;

            }

            private setDbVersion(dbVersion: number) {
                if (dbVersion == null) {
                    localStorage.setItem('JsStorage_Db_Version', '1');
                }
                else if (dbVersion > Number(localStorage.getItem('JsStorage_Db_Version'))) {
                    localStorage.setItem('JsStorage_Db_Version', dbVersion.toString());
                }
            }

        }
    }
}