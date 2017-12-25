
namespace JsStore {
    export namespace Model {
        export class DataBase {
            _name: string;
            _tables: Table[] = [];

            constructor(dataBase: IDataBaseOption) {
                this._name = dataBase.Name;
                dataBase.Tables.forEach(function (item) {
                    this._tables.push(new Table(item, this._name));
                }, this);
            }
        }
    }
}
