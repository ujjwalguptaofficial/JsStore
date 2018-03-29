import { LogHelper } from "../log_helper";
import { Error_Type } from "../enums";
var Column = /** @class */ (function () {
    function Column(key, tableName) {
        if (key.Name != null) {
            this._name = key.Name;
        }
        else {
            var err = new LogHelper(Error_Type.UndefinedColumnName, { TableName: tableName });
            err.throw();
        }
        this._autoIncrement = key.AutoIncrement != null ? key.AutoIncrement : false;
        this._primaryKey = key.PrimaryKey != null ? key.PrimaryKey : false;
        this._unique = key.Unique != null ? key.Unique : false;
        this._notNull = key.NotNull != null ? key.NotNull : false;
        this._dataType = key.DataType != null ? key.DataType : (key.AutoIncrement ? 'number' : null);
        this._default = key.Default;
        this._multiEntry = key.MultiEntry == null ? false : key.MultiEntry;
        this._enableSearch = key.EnableSearch == null ? true : key.EnableSearch;
    }
    return Column;
}());
export { Column };
//# sourceMappingURL=column.js.map