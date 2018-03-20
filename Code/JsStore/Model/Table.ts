export class Table {
    _name: string;
    _columns: Column[] = [];
    _version: number;
    _primaryKey: string;

    constructor(table: ITableOption) {
        this._name = table.Name;
        this._version = table.Version == null ? 1 : table.Version;
        table.Columns.forEach(function (item) {
            this._columns.push(new Column(item, table.Name));
        }, this);
    }
}