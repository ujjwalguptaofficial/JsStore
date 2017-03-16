var JsStorage;
(function (JsStorage) {
    var DBType;
    (function (DBType) {
        DBType[DBType["IndexedDb"] = 0] = "IndexedDb";
        DBType[DBType["WebSql"] = 1] = "WebSql";
    })(DBType = JsStorage.DBType || (JsStorage.DBType = {}));
    ;
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Model;
    (function (Model) {
        var Column = (function () {
            function Column(key) {
                if (key.Name != null) {
                    this.Name = key.Name;
                }
                else {
                    throw "Column Name is not defined";
                }
                this.AutoIncrement = this.AutoIncrement == null ? false : this.AutoIncrement;
                this.Primarykey = this.Primarykey == null ? false : this.Primarykey;
            }
            return Column;
        }());
        Model.Column = Column;
    })(Model = JsStorage.Model || (JsStorage.Model = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Model;
    (function (Model) {
        var Table = (function () {
            function Table(table, dbName) {
                this.Name = "";
                this.Columns = [];
                //internal Members
                this.RequireDelete = false;
                this.RequireCreation = false;
                this.PrimaryKey = "";
                this.Name = table.Name.toLowerCase();
                this.Version = table.Version == undefined ? 1 : table.Version;
                var That = this;
                this.Columns.forEach(function (item) {
                    That.Columns.push(new Model.Column(item));
                });
                this.setRequireDelete();
                this.setDbVersion(dbName);
                this.setPrimaryKey();
            }
            //private methods
            Table.prototype.setPrimaryKey = function () {
                //this.Key = new Column();//
                var That = this;
                this.Columns.forEach(function (item) {
                    if (item.Primarykey && That.PrimaryKey.length == 0) {
                        That.PrimaryKey = item.Name;
                        localStorage.setItem("JsStorage_" + That.Name + "_" + item.Name, "true");
                    }
                    else if (item.Primarykey && That.PrimaryKey.length > 0) {
                        localStorage.setItem("JsStorage_" + That.Name + "_" + item.Name, "");
                        throw "Multiple primary key are not allowed";
                    }
                });
            };
            Table.prototype.setRequireDelete = function () {
                var TableVersion = localStorage.getItem("JsStorage_" + this.Name);
                if (TableVersion == null || localStorage.getItem('JsStorage_Db_Version') == null) {
                    this.RequireCreation = true;
                }
                else if (TableVersion != this.Version.toString()) {
                    this.RequireDelete = true;
                }
                this.Version = this.Version == null ? 1 : this.Version;
            };
            Table.prototype.setDbVersion = function (dbName) {
                if (this.Version == null) {
                    localStorage.setItem(dbName + 'Db_Version', '1');
                }
                else if (this.Version > Number(localStorage.getItem(dbName + 'Db_Version'))) {
                    localStorage.setItem(dbName + 'Db_Version', this.Version.toString());
                }
            };
            return Table;
        }());
        Model.Table = Table;
    })(Model = JsStorage.Model || (JsStorage.Model = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Model;
    (function (Model) {
        var DataBase = (function () {
            function DataBase(dataBase) {
                this.Tables = [];
                this.Name = dataBase.Name.toLowerCase();
                var That = this;
                dataBase.Tables.forEach(function (item) {
                    That.Tables.push(new Model.Table(item, That.Name));
                });
            }
            return DataBase;
        }());
        Model.DataBase = DataBase;
    })(Model = JsStorage.Model || (JsStorage.Model = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var WebSqlLogic = (function () {
            function WebSqlLogic() {
            }
            return WebSqlLogic;
        }());
        Business.WebSqlLogic = WebSqlLogic;
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
var Table = JsStorage.Model.Table;
var Column = JsStorage.Model.Column;
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var IndexDbLogic = (function () {
            function IndexDbLogic(dataBase) {
                this.createDb = function (objMain, onSuccess, onError) {
                    var That = this, DbVersion = Number(localStorage.getItem(this.ActiveDataBase.Name + 'Db_Version')), DbRequest = window.indexedDB.open(this.ActiveDataBase.Name, DbVersion);
                    DbRequest.onerror = function (event) {
                        if (onError != null) {
                            onError(event.target.error);
                        }
                    };
                    DbRequest.onsuccess = function (event) {
                        objMain.Status.ConStatus = JsStorage.ConnectionStatus.Connected;
                        That.DbConnection = DbRequest.result;
                        That.DbConnection = DbRequest.result;
                        That.DbConnection.onclose = function () {
                            objMain.Status.ConStatus = JsStorage.ConnectionStatus.Closed;
                            objMain.Status.LastError = "Connection Closed, trying to reconnect";
                        };
                        That.DbConnection.onerror = function (e) {
                        };
                        That.DbConnection.onabort = function (e) {
                            objMain.Status.ConStatus = JsStorage.ConnectionStatus.Closed;
                            objMain.Status.LastError = "Connection Closed, trying to reconnect";
                        };
                        if (onSuccess != null) {
                            onSuccess(objMain);
                        }
                    };
                    DbRequest.onupgradeneeded = function (event) {
                        var db = event.target.result;
                        That.ActiveDataBase.Tables.forEach(function (item) {
                            if (item.RequireDelete) {
                                // Delete the old datastore.    
                                if (db.objectStoreNames.contains(item.Name)) {
                                    db.deleteObjectStore(item.Name);
                                }
                                That.createObjectStore(db, item);
                            }
                            else if (item.RequireCreation) {
                                That.createObjectStore(db, item);
                            }
                        });
                    };
                };
                this.ActiveDataBase = dataBase;
            }
            IndexDbLogic.prototype.openDb = function (objMain, onSuccess, onError) {
                if (objMain.Status.ConStatus != JsStorage.ConnectionStatus.Connected) {
                    if (this.ActiveDataBase.Name.length > 0) {
                        var DbVersion = Number(localStorage.getItem(this.ActiveDataBase.Name + 'Db_Version')), DbRequest = window.indexedDB.open(this.ActiveDataBase.Name, DbVersion), That = this;
                        DbRequest.onerror = function (event) {
                            if (onError != null) {
                                onError(event.target.error);
                            }
                        };
                        DbRequest.onsuccess = function (event) {
                            objMain.Status.ConStatus = JsStorage.ConnectionStatus.Connected;
                            That.DbConnection = DbRequest.result;
                            That.DbConnection.onclose = function () {
                                objMain.Status.ConStatus = JsStorage.ConnectionStatus.Closed;
                                objMain.Status.LastError = "Connection Closed, trying to reconnect";
                            };
                            That.DbConnection.onerror = function (e) {
                            };
                            That.DbConnection.onabort = function (e) {
                                objMain.Status.ConStatus = JsStorage.ConnectionStatus.Closed;
                                objMain.Status.LastError = "Connection Closed, trying to reconnect";
                            };
                            if (onSuccess != null) {
                                onSuccess(objMain);
                            }
                        };
                    }
                    else {
                        if (onError != null) {
                            onError({
                                Name: "DbNotFound",
                                Value: "DataBase name is not found, please first initiate the db using createDb"
                            });
                        }
                    }
                }
                else {
                    if (onSuccess != null) {
                        onSuccess();
                    }
                }
            };
            IndexDbLogic.prototype.closeDb = function (objMain) {
                if (objMain.Status.ConStatus == JsStorage.ConnectionStatus.Connected) {
                    this.DbConnection.close();
                }
            };
            IndexDbLogic.prototype.get = function (query, onSuccess, onError) {
                var That = this, ErrorOccured = false, ErrorCount = 0, Transaction = That.DbConnection.transaction([query.Table.toLowerCase()], "readonly"), ObjectStore = Transaction.objectStore(query.Table);
                if (query.Where == undefined) {
                    var CursorOpenRequest = ObjectStore.openCursor(), Results = [];
                    CursorOpenRequest.onsuccess = function (e) {
                        var TempResult = e.target.result;
                        console.log(TempResult);
                        if (TempResult) {
                            Results.push(TempResult.value);
                            TempResult.continue();
                        }
                        else {
                            if (onSuccess != null) {
                                onSuccess(Results);
                            }
                        }
                    };
                    CursorOpenRequest.onerror = onErrorGetRequest;
                }
                else {
                    query.Where.every(function (item, index) {
                        if (!ErrorOccured) {
                            if (item.Column == undefined) {
                                throw "Column is undefined in Case for tableName:" + query.Table;
                            }
                            else if (item.Value == undefined) {
                                throw "Column value is undefined in Case for Column Name:" + item.Column + "for tableName:" + query.Table;
                            }
                            else {
                                if (this.isPrimaryKey(query.Table, item)) {
                                    var GetRequest = ObjectStore.get(item.Value);
                                    GetRequest.onsuccess = onSuceessGetRequest;
                                    GetRequest.onerror = function (e) {
                                        ErrorOccured = true;
                                        ++ErrorCount;
                                        onErrorGetRequest(e);
                                    };
                                }
                                else {
                                    var GetRequest = ObjectStore.index(item.Column).get(item.Value);
                                    GetRequest.onsuccess = onSuceessGetRequest;
                                    GetRequest.onerror = onErrorGetRequest;
                                }
                            }
                        }
                        return !ErrorOccured;
                    });
                }
                var onSuceessGetRequest = function (event) {
                    var Result = event.target.result;
                    if (onSuccess != null) {
                        onSuccess(Result);
                    }
                };
                var onErrorGetRequest = function (e) {
                    if (ErrorCount == 1) {
                        if (onError != null) {
                            onError(e.target.error);
                        }
                    }
                };
            };
            IndexDbLogic.prototype.delete = function (query, onSuccess, onError) {
                var That = this, Transaction = That.DbConnection.transaction([query.Table.toLowerCase()], "readonly"), ObjectStore = Transaction.objectStore(query.Table);
                if (query.Where == undefined) {
                    var CursorOpenRequest = ObjectStore.openCursor(), Results = [];
                    CursorOpenRequest.onsuccess = function (e) {
                        var TempResult = e.target.result;
                        console.log(TempResult);
                        if (TempResult) {
                            Results.push(TempResult.value);
                            TempResult.continue();
                        }
                        else {
                            if (onSuccess != null) {
                                onSuccess(Results);
                            }
                        }
                    };
                    CursorOpenRequest.onerror = onErrorGetRequest;
                }
                else {
                    // if (query.Case.Column == undefined) {
                    //     throw "Column is undefined in Case for tableName:" + query.Table;
                    // }
                    // else if (query.Case.Value == undefined) {
                    //     throw "Column value is undefined in Case for Column Name:" + query.Case.Column + "for tableName:" + query.Table;
                    // }
                    // else {
                    //     if (this.isPrimaryKey(query)) {
                    //         var GetRequest = ObjectStore.delete(query.Case.Value);
                    //         GetRequest.onsuccess = onSuceessGetRequest;
                    //         GetRequest.onerror = onErrorGetRequest;
                    //     }
                    //     else {
                    //         var GetRequest = ObjectStore.index(query.Case.Column).get(query.Case.Value);
                    //         GetRequest.onsuccess = onSuceessGetRequest;
                    //         GetRequest.onerror = onErrorGetRequest;
                    //     }
                    // }
                }
                var onSuceessGetRequest = function (event) {
                    var Result = event.target.result;
                    if (onSuccess != null) {
                        onSuccess(Result);
                    }
                };
                var onErrorGetRequest = function (e) {
                    if (onError != null) {
                        onError(e.target.error);
                    }
                };
            };
            IndexDbLogic.prototype.update = function (query, onSuccess, onError) {
                var That = this, ErrorOccured = false, ErrorCount = 0, RowAffected = 0, Transaction = That.DbConnection.transaction([query.Table.toLowerCase()], "readonly"), ObjectStore = Transaction.objectStore(query.Table);
                if (query.Where == undefined) {
                    var CursorOpenRequest = ObjectStore.openCursor();
                    CursorOpenRequest.onsuccess = function (e) {
                        var Cursor = e.target.result;
                        if (Cursor) {
                            query.Set.forEach(function (item) {
                                Cursor.value[item.Column] = item.Value;
                            });
                            Cursor.continue();
                        }
                        else {
                            onSuceessRequest(RowAffected);
                        }
                    };
                    CursorOpenRequest.onerror = onErrorGetRequest;
                }
                else {
                    query.Where.every(function (item, index) {
                        if (!ErrorOccured) {
                            if (item.Column == undefined) {
                                throw "Column is undefined in Case for tableName:" + query.Table;
                            }
                            else if (item.Value == undefined) {
                                throw "Column value is undefined in Case for Column Name:" + item.Column + "for tableName:" + query.Table;
                            }
                            else {
                                if (this.isPrimaryKey(query.Table, item)) {
                                    var GetRequest = ObjectStore.put(item.Value);
                                    GetRequest.onsuccess = function () {
                                        onSuceessRequest(1);
                                    };
                                    GetRequest.onerror = function (e) {
                                        ErrorOccured = true;
                                        ++ErrorCount;
                                        onErrorGetRequest(e);
                                    };
                                }
                                else {
                                    // var GetRequest = ObjectStore.index(item.Column);
                                    var CursorOpenRequest = ObjectStore.index(item.Column).openCursor(IDBKeyRange.only(item.Value)), ExecutionNo = 0;
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor = e.target.result;
                                        if (Cursor) {
                                            // if (Cursor.value.hasOwnProperty(item.Column)) {
                                            // }
                                            // else
                                            // {
                                            //     onErrorGetRequest(<Error>{
                                            //         Name:"ColumnNotExist",
                                            //          Value:"The column"+ + "does not exist"
                                            //     })
                                            // }
                                            Cursor.value[item.Column] = item.Value;
                                            ++RowAffected;
                                            Cursor.Continue();
                                        }
                                        else {
                                            ++ExecutionNo;
                                            if (ExecutionNo == query.Where.length) {
                                                onSuceessRequest(RowAffected);
                                            }
                                        }
                                    };
                                }
                                CursorOpenRequest.onerror = function (e) {
                                    ErrorOccured = true;
                                    ++ErrorCount;
                                    onErrorGetRequest(e);
                                };
                            }
                        }
                        return !ErrorOccured;
                    });
                }
                var onSuceessRequest = function (rowsAffected) {
                    if (onSuccess != null) {
                        onSuccess(rowsAffected);
                    }
                };
                var onErrorGetRequest = function (e) {
                    if (ErrorCount == 1) {
                        if (onError != null) {
                            onError(e.target.error);
                        }
                    }
                };
            };
            IndexDbLogic.prototype.and = function () {
                return this;
            };
            IndexDbLogic.prototype.insert = function (tableName, values, onSuccess, onError) {
                try {
                    tableName = tableName.toLowerCase();
                    var TotalRowsAffected = 0, Store = this.DbConnection.transaction([tableName], "readwrite").objectStore(tableName);
                    if (!Array.isArray(values)) {
                        throw "Value should be array :- supplied value is not array";
                    }
                    else if (values.length > 0) {
                        values.forEach(function (value) {
                            var AddResult = Store.add(value);
                            AddResult.onerror = function (e) {
                                if (onError != null) {
                                    onError(e.target.error, TotalRowsAffected);
                                }
                            };
                            AddResult.onsuccess = function (e) {
                                ++TotalRowsAffected;
                                if (values.length == TotalRowsAffected) {
                                    if (onSuccess != null) {
                                        onSuccess(TotalRowsAffected);
                                    }
                                }
                            };
                        });
                    }
                    else {
                        throw "no value supplied";
                    }
                }
                catch (ex) {
                    console.error(ex);
                }
            };
            IndexDbLogic.prototype.isPrimaryKey = function (tablename, condition) {
                return localStorage.getItem("JsStorage_" + tablename + "_" + condition.Column).toLowerCase() == "true" ? true : false;
            };
            IndexDbLogic.prototype.createObjectStore = function (dbConnection, item) {
                try {
                    if (item.PrimaryKey.length > 0) {
                        var Store = dbConnection.createObjectStore(item.Name, {
                            keyPath: item.PrimaryKey
                        });
                        item.Columns.forEach(function (column) {
                            if (!column.Primarykey) {
                                Store.createIndex(item.Name, item.Name, { unique: false });
                            }
                        });
                    }
                    else {
                        var store = dbConnection.createObjectStore(item.Name, {
                            autoIncrement: true
                        });
                        item.Columns.forEach(function (column) {
                            Store.createIndex(item.Name, item.Name, { unique: false });
                        });
                    }
                    localStorage.setItem("JsStorage_" + item.Name, item.Version.toString());
                }
                catch (e) {
                    console.error(e);
                }
            };
            return IndexDbLogic;
        }());
        Business.IndexDbLogic = IndexDbLogic;
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
var DataBase = JsStorage.Model.DataBase;
var JsStorage;
(function (JsStorage) {
    var ConnectionStatus;
    (function (ConnectionStatus) {
        ConnectionStatus[ConnectionStatus["Connected"] = 1] = "Connected";
        ConnectionStatus[ConnectionStatus["Closed"] = 2] = "Closed";
        ConnectionStatus[ConnectionStatus["NotStarted"] = 3] = "NotStarted";
    })(ConnectionStatus = JsStorage.ConnectionStatus || (JsStorage.ConnectionStatus = {}));
    var Main = (function () {
        function Main() {
            this.Status = {
                ConStatus: ConnectionStatus.NotStarted,
                LastError: ""
            };
            /**
                * determine and set the DataBase Type
                *
                *
                * @memberOf MainLogic
                */
            this.setDbType = function () {
                window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
                if (indexedDB) {
                    this.DbType = JsStorage.DBType.IndexedDb;
                    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
                    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
                }
                else if (window.openDatabase) {
                    this.DbType = JsStorage.DBType.WebSql;
                }
                else {
                    throw 'Browser does not support Db Implementation';
                }
            };
            this.setDbType();
        }
        /**
         *
         *
         * @param {IDataBase} dataBase
         * @param {Function} onSuccess
         * @param {Function} onError
         * @returns
         *
         * @memberOf Main
         */
        Main.prototype.createDb = function (dataBase, onSuccess, onError) {
            if (this.DbType == JsStorage.DBType.IndexedDb) {
                var Db = new DataBase(dataBase);
                this.IndexDbObj = new JsStorage.Business.IndexDbLogic(Db);
                var DbVersion = Number(localStorage.getItem(dataBase.Name + 'Db_Version'));
                this.IndexDbObj.createDb(this, onSuccess, onError);
            }
            else {
                this.WebSqlObj = new JsStorage.Business.WebSqlLogic();
            }
            return this;
        };
        /**
         *
         *
         * @param {Function} onSuccess
         * @param {Function} onError
         *
         * @memberOf Main
         */
        Main.prototype.openDb = function (onSuccess, onError) {
            if (this.DbType == JsStorage.DBType.IndexedDb) {
                this.IndexDbObj.openDb(this, onSuccess, onError);
            }
            else {
            }
        };
        /**
         *
         *
         * @param {Function} onSuccess
         * @param {Function} onError
         *
         * @memberOf Main
         */
        Main.prototype.closeDb = function (onSuccess, onError) {
            if (this.DbType == JsStorage.DBType.IndexedDb) {
                this.IndexDbObj.closeDb(this);
            }
            else {
            }
        };
        /**
         *
         *
         * @param {IQuery} query
         * @param {Function} onSuccess
         * @param {Function} onError
         *
         * @memberOf Main
         */
        Main.prototype.get = function (query, onSuccess, onError) {
            if (this.Status.ConStatus == ConnectionStatus.Connected) {
                if (this.DbType == JsStorage.DBType.IndexedDb) {
                    this.IndexDbObj.get(query, onSuccess, onError);
                }
                else {
                }
            }
            else if (this.Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.get(query, onSuccess, onError);
                }, 200);
            }
            else if (this.Status.ConStatus == ConnectionStatus.Closed) {
            }
        };
        /**
         *
         *
         * @param {string} table
         * @param {any} value
         * @param {Function} onSuccess
         * @param {Function} onError
         *
         * @memberOf Main
         */
        Main.prototype.insert = function (query, onSuccess, onError) {
            if (this.DbType == JsStorage.DBType.IndexedDb) {
                this.IndexDbObj.insert(query.Into, query.Values, onSuccess, onError);
            }
            else {
            }
        };
        Main.prototype.update = function (query, onSuccess, onError) {
        };
        Main.prototype.delete = function () {
        };
        return Main;
    }());
    JsStorage.Main = Main;
})(JsStorage || (JsStorage = {}));
/// <reference path="Business/CommonLogic.ts" />
/// <reference path="Model/Column.ts" />
/// <reference path="Model/Table.ts" />
/// <reference path="Model/DataBase.ts" />
/// <reference path="Business/WebSqlLogic.ts" />
/// <reference path="Business/IndexDbLogic.ts" />
/// <reference path="Business/MainLogic.ts" />
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var DbHelperLogic = (function () {
            function DbHelperLogic() {
            }
            DbHelperLogic.prototype.and = function () {
                return this;
            };
            DbHelperLogic.prototype.or = function () {
                return this;
            };
            return DbHelperLogic;
        }());
        Business.DbHelperLogic = DbHelperLogic;
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
/// <reference path="CommonLogic.ts" />
var JsStorage;
(function (JsStorage) {
    var DbType;
    (function (DbType) {
        DbType[DbType["IndexedDb"] = 0] = "IndexedDb";
        DbType[DbType["WebSql"] = 1] = "WebSql";
    })(DbType || (DbType = {}));
    ;
})(JsStorage || (JsStorage = {}));
//# sourceMappingURL=JsStorage.js.map