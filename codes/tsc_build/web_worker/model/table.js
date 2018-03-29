import { Column } from "./column";
var Table = /** @class */ (function () {
    function Table(table) {
        this._columns = [];
        this._name = table.Name;
        this._version = table.Version == null ? 1 : table.Version;
        table.Columns.forEach(function (item) {
            this._columns.push(new Column(item, table.Name));
        }, this);
    }
    return Table;
}());
export { Table };
//# sourceMappingURL=table.js.map