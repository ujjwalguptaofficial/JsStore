
namespace JsStore {
    export namespace Model {
        export class DbHelper {
            _name: string;
            _tables: Table[] = [];

            constructor(dataBase: DataBase) {
                this._name = dataBase._name;
                this._tables = dataBase._tables;
            }

            public createMetaData = function (callBack: (tablesMetaData: TableHelper[]) => void) {
                var index = 0,
                    table_helpers: TableHelper[] = [],
                    createMetaDataForTable = function () {
                        if (index < this._tables.length) {
                            var table: Table = this._tables[index],
                                table_helper: TableHelper = new TableHelper(table),
                                ats_table = table_helper.getAtsTable();
                            table_helper.createMetaData(this._name, function () {
                                table_helper._callback = null;
                                table_helpers.push(table_helper);
                                createMetaDataForTable();
                            });
                            if (ats_table != null) {
                                this._tables.push(ats_table);
                            }
                            ++index;
                        }
                        else {
                            callBack(table_helpers);
                        }
                    }.bind(this);
                createMetaDataForTable();
            };

        }
    }
}
