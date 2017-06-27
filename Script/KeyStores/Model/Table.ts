module JsStore {
    export module KeyStores {
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
                    this.Name = table.Name;
                    this.Version = table.Version == undefined ? 1 : table.Version;
                    var That = this;
                    table.Columns.forEach(function (item) {
                        That.Columns.push(new Column(item, table.Name));
                    })

                    this.setRequireDelete(dbName);
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
                        }
                    })

                }

                private setRequireDelete(dbName: string) {
                    this.RequireDelete = true;
                }



            }
        }
    }
}