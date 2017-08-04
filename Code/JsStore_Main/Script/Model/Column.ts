module JsStore {
    export module Model {

        export interface IColumn {
            Name: string;
            AutoIncrement: boolean;
            PrimaryKey: boolean;
            Unique: boolean;
            NotNull: boolean;
            DataType: string;
            Default: any;
        }

        export class Column implements IColumn {
            Name: string;
            AutoIncrement: boolean;
            PrimaryKey: boolean;
            Unique: boolean;
            NotNull: boolean;
            DataType: string;
            Default: any;

            constructor(key: IColumn, tableName: string) {
                if (key.Name != null) {
                    this.Name = key.Name;
                }
                else {
                    throw "Column Name is not defined for table:" + tableName;
                }
                this.AutoIncrement = key.AutoIncrement != null ? key.AutoIncrement : false;
                this.PrimaryKey = key.PrimaryKey != null ? key.PrimaryKey : false;
                this.Unique = key.Unique != null ? key.Unique : false;
                this.NotNull = key.NotNull != null ? key.NotNull : false;
                this.DataType = key.DataType != null ? key.DataType : '';
                this.Default = key.Default;
            }

        }

    }
}
