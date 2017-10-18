
module JsStore {
    export module Model {
        export interface IDataBase {
            Name: string;
            Tables: Array<ITable>;
        }

        export class DataBase implements IDataBase {
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
