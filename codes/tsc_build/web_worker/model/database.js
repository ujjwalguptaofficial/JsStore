import { Table } from "./table";
var DataBase = /** @class */ (function () {
    function DataBase(dataBase) {
        this._tables = [];
        this._name = dataBase.Name;
        dataBase.Tables.forEach(function (item) {
            this._tables.push(new Table(item));
        }, this);
    }
    return DataBase;
}());
export { DataBase };
//# sourceMappingURL=database.js.map