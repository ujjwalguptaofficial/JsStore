namespace JsStore {
    export namespace Business {
        export namespace Update {
            export class SchemaChecker {
                _table: Table;
                constructor(table: Table) {
                    this._table = table;
                }

                check = function (inValue, tblName) {
                    var error: IError = null;
                    if (typeof inValue === 'object') {
                        if (this._table) {
                            // loop through table column and find data is valid
                            this._table._columns.every(function (column: Model.Column) {
                                if (error === null) {
                                    if (column._name in inValue) {
                                        error = this.checkByColumn(column, inValue[column._name]);
                                    }
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }, this);
                        }
                        else {
                            error = new Error(
                                Error_Type.TableNotExist,
                                { TableName: tblName }
                            ).get();
                        }
                    }
                    else {
                        error = new Error(Error_Type.NotObject).get();
                    }
                    return error;
                };

                private checkByColumn = function (column, value) {
                    var error: IError = null;
                    // check not null schema
                    if (column._notNull && isNull(value)) {
                        error = new Error(
                            Error_Type.NullValue, { ColumnName: column._name }
                        ).get();
                    }

                    // check datatype
                    var type = typeof value;
                    if (column._dataType) {
                        if (type !== column._dataType && type !== 'object') {
                            error = new Error(Error_Type.BadDataType,
                                { ColumnName: column._name }
                            ).get();
                        }
                    }

                    // check allowed operators
                    if (type === 'object') {
                        var allowed_prop = ['+', '-', '*', '/'];
                        for (var prop in value) {
                            if (allowed_prop.indexOf(prop) < 0) {
                                error = new Error(
                                    Error_Type.InvalidOp,
                                    { Op: prop }
                                ).get();
                            }
                            break;
                        }
                    }
                    return error;
                };
            }
        }
    }
}