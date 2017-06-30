module JsStore {
    export module KeyStores {
        export module Model {
            export class DataBase implements IDataBase{
                Name: string;
                Tables: Array<Table> = [];

                constructor(dataBase: IDataBase) {
                    var That = this;
                    this.Name = dataBase.Name;
                    dataBase.Tables.forEach(function (item) {
                        That.Tables.push(new Table(item, That.Name));
                    })

                }
            }
        }
    }
}