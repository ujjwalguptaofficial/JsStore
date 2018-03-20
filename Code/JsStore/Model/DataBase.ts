import { IDataBaseOption } from '../interfaces';
import { Table } from "./Table";

export class DataBase {
    _name: string;
    _tables: Table[] = [];

    constructor(dataBase: IDataBaseOption) {
        this._name = dataBase.Name;
        dataBase.Tables.forEach(function (item) {
            this._tables.push(new Table(item));
        }, this);
    }
}
