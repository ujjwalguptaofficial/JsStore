namespace JsStore {
    export namespace Model {

        export interface IColumn {
            Name: string;
            AutoIncrement: boolean;
            PrimaryKey: boolean;
            Unique: boolean;
            NotNull: boolean;
            DataType: string;
            Default: any;
            MultiEntry: boolean;
        }

        export class Column {
            _name: string;
            _autoIncrement: boolean;
            _primaryKey: boolean;
            _unique: boolean;
            _notNull: boolean;
            _dataType: string;
            _default: any;
            _multiEntry: boolean;

            constructor(key: IColumn, tableName: string) {
                if (key.Name != null) {
                    this._name = key.Name;
                }
                else {
                    throwError("Column Name is not defined for table:" + tableName);
                }
                this._autoIncrement = key.AutoIncrement != null ? key.AutoIncrement : false;
                this._primaryKey = key.PrimaryKey != null ? key.PrimaryKey : false;
                this._unique = key.Unique != null ? key.Unique : false;
                this._notNull = key.NotNull != null ? key.NotNull : false;
                this._dataType = key.DataType != null ? key.DataType : (key.AutoIncrement ? 'number' : null);
                this._default = key.Default;
                this._multiEntry = key.MultiEntry;
            }

        }

    }
}
