module JsStorage {
    export module Model {
        export interface IDataBase {
            Name: string;
            Tables: Array<ITable>;
        }
        export class DataBase {
            Name: string;
            Tables: Array<Table> = [];
            // constructor(name: string, tables: Array<Table>) {
            //     this.Name = name;
            //     this.Tables = tables;
            // }
            constructor(dataBase: IDataBase) {
                this.Name = dataBase.Name.toLowerCase();
                var That = this;
                dataBase.Tables.forEach(function (item) {
                    That.Tables.push(new Table(item, dataBase.Name));
                })
            }
        }
    }
}