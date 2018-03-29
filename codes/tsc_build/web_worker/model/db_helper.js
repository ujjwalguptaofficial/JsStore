import { TableHelper } from "./table_helper";
var DbHelper = /** @class */ (function () {
    function DbHelper(dataBase) {
        this._tables = [];
        this._name = dataBase._name;
        this._tables = dataBase._tables;
    }
    DbHelper.prototype.createMetaData = function (callBack) {
        var _this = this;
        var index = 0, table_helpers = [], createMetaDataForTable = function () {
            if (index < _this._tables.length) {
                var table = _this._tables[index], table_helper = new TableHelper(table);
                table_helper.createMetaData(_this._name, function () {
                    table_helper._callback = null;
                    table_helpers.push(table_helper);
                    createMetaDataForTable();
                });
                ++index;
            }
            else {
                callBack(table_helpers);
            }
        };
        createMetaDataForTable();
    };
    return DbHelper;
}());
export { DbHelper };
//# sourceMappingURL=db_helper.js.map