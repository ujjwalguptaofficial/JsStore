module JsStorage {
    export module Model {
        export interface IColumn {
            Name: string;
            AutoIncrement: boolean;
            Primarykey: boolean;
        }
        export class Column implements IColumn {
            Name: string;
            AutoIncrement: boolean;
            Primarykey: boolean;

            constructor(key: IColumn) {
                if (key.Name != null) {
                    this.Name = key.Name
                }
                else {
                    throw "Column Name is not defined";
                }
                this.AutoIncrement = this.AutoIncrement == null ? false : this.AutoIncrement;
                this.Primarykey = this.Primarykey == null ? false : this.Primarykey;

            }

        }

    }
}