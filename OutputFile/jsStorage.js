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
            // constructor(name: string, tables: Array<Table>) {
            //     this.Name = name;
            //     this.Tables = tables;
            // }
            function DataBase(dataBase) {
                this.Tables = [];
                this.Name = dataBase.Name.toLowerCase();
                var That = this;
                dataBase.Tables.forEach(function (item) {
                    That.Tables.push(new Model.Table(item, dataBase.Name));
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
var Column = JsStorage.Model.Column;
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var IndexDbLogic = (function () {
            function IndexDbLogic(dataBase) {
                this.openDataBase = function (dbVersion, callBack, objMain) {
                    var That = this;
                    var DbRequest = window.indexedDB.open(this.ActiveDataBase.Name, dbVersion);
                    DbRequest.onerror = function (event) {
                        throw "Error in opening DataBase";
                    };
                    DbRequest.onsuccess = function (event) {
                        JsStorage.IndexDbConnection = DbRequest.result;
                        if (callBack != null) {
                            callBack(objMain);
                        }
                        return objMain;
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
            IndexDbLogic.prototype.get = function (query, callBack) {
                var That = this, Transaction = JsStorage.IndexDbConnection.transaction([query.Table.toLowerCase()], "readonly"), ObjectStore = Transaction.objectStore(query.Table);
                if (query.Case == undefined) {
                    var CursorOpenRequest = ObjectStore.openCursor(), Result = [];
                    CursorOpenRequest.onsuccess = function (e) {
                        var TempResult = e.target.result;
                        console.log(TempResult);
                        if (TempResult) {
                        }
                    };
                    CursorOpenRequest.onerror = onErrorGetRequest;
                }
                else {
                    if (query.Case.Column == undefined) {
                        throw "Column is undefined in Case for tableName:" + query.Table;
                    }
                    else if (query.Case.Value == undefined) {
                        throw "Column value is undefined in Case for Column Name:" + query.Case.Column + "for tableName:" + query.Table;
                    }
                    else {
                        if (this.isPrimaryKey(query)) {
                            var GetRequest = ObjectStore.get(query.Case.Value);
                            GetRequest.onsuccess = onSuceessGetRequest;
                            GetRequest.onerror = onErrorGetRequest;
                        }
                        else {
                            var GetRequest = ObjectStore.index(query.Case.Column).get(query.Case.Value);
                            GetRequest.onsuccess = onSuceessGetRequest;
                            GetRequest.onerror = onErrorGetRequest;
                        }
                    }
                }
                var onSuceessGetRequest = function (event) {
                    var Result = event.target.result;
                    if (callBack != null) {
                        callBack(Result);
                    }
                };
                var onErrorGetRequest = function (event) {
                    console.warn("Error occured in retrieving data");
                    callBack([]);
                };
            };
            IndexDbLogic.prototype.and = function () {
                return this;
            };
            IndexDbLogic.prototype.add = function (tableName, values, onSuccess, onError) {
                try {
                    tableName = tableName.toLowerCase();
                    var TotalRowsAffected = 0, Store = JsStorage.IndexDbConnection.transaction([tableName], "readwrite").objectStore(tableName);
                    if (!Array.isArray(values)) {
                        throw "Value should be array :- supplied value is not array";
                    }
                    else if (values.length > 0) {
                        values.forEach(function (value) {
                            var AddResult = Store.add(value);
                            AddResult.onerror = function (e) {
                                if (onError != null) {
                                    onError(TotalRowsAffected);
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
            IndexDbLogic.prototype.isPrimaryKey = function (query) {
                return localStorage.getItem("JsStorage_" + query.Table + "_" + query.Case.Column).toLowerCase() == "true" ? true : false;
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
var Table = JsStorage.Model.Table;
var DataBase = JsStorage.Model.DataBase;
var JsStorage;
(function (JsStorage) {
    var Main = (function () {
        function Main() {
            /**
                * determine and set the DataBase Type
                *
                *
                * @memberOf MainLogic
                */
            this.setDbType = function () {
                window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
                if (indexedDB) {
                    JsStorage.DbType = JsStorage.DBType.IndexedDb;
                    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
                    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
                }
                else if (window.openDatabase) {
                    JsStorage.DbType = JsStorage.DBType.WebSql;
                }
                else {
                    throw 'Browser does not support Db Implementation';
                }
            };
            this.setDbType();
        }
        Main.prototype.createDb = function (dataBase, callBack) {
            if (JsStorage.DbType == JsStorage.DBType.IndexedDb) {
                var Db = new DataBase(dataBase);
                JsStorage.IndexDbObj = new JsStorage.Business.IndexDbLogic(Db);
                var DbVersion = Number(localStorage.getItem(dataBase.Name + 'Db_Version'));
                JsStorage.IndexDbObj.openDataBase(DbVersion, callBack, this);
            }
            else {
                JsStorage.WebSqlObj = new JsStorage.Business.WebSqlLogic();
            }
            //return this;
        };
        Main.prototype.get = function (query, callBack) {
            if (JsStorage.DbType == JsStorage.DBType.IndexedDb) {
                JsStorage.IndexDbObj.get(query, callBack);
            }
            else {
            }
        };
        Main.prototype.add = function (table, value, onSuccess, onError) {
            if (JsStorage.DbType == JsStorage.DBType.IndexedDb) {
                JsStorage.IndexDbObj.add(table, value, onSuccess, onError);
            }
            else {
            }
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