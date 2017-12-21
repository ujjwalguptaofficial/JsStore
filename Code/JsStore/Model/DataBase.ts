
namespace JsStore {
    export namespace Model {
        export interface IDataBase {
            Name: string;
            Tables: ITable[];
        }

        export class DataBase {
            _name: string;
            _tables: Table[] = [];

            constructor(dataBase: IDataBase) {
                this._name = dataBase.Name;
                dataBase.Tables.forEach(function (item) {
                    this._tables.push(new Table(item, this.Name));
                }, this);
            }
        }
    }
}
