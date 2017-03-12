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
    var Business;
    (function (Business) {
        var IndexDbLogic = (function () {
            function IndexDbLogic() {
                this.openDataBase = function (dbVersion, dataBase) {
                    var That = this;
                    var DbRequest = window.indexedDB.open(dataBase.Name, dbVersion);
                    DbRequest.onerror = function (event) {
                        throw "Error in opening DataBase";
                    };
                    DbRequest.onsuccess = function (event) {
                        That.DbConnection = DbRequest.result;
                    };
                    DbRequest.onupgradeneeded = function (event) {
                        var db = event.target.result;
                        dataBase.Tables.forEach(function (item) {
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
            }
            IndexDbLogic.prototype.createObjectStore = function (dbConnection, item) {
                try {
                    if (item.PrimaryKey.length > 0) {
                        var store = dbConnection.createObjectStore(item.Name, {
                            keyPath: item.PrimaryKey
                        });
                    }
                    else {
                        var store = dbConnection.createObjectStore(item.Name, {
                            autoIncrement: true
                        });
                    }
                    localStorage.setItem("JsStorage_" + item.Name, item.Version.toString());
                }
                catch (e) {
                    console.warn(e);
                }
            };
            return IndexDbLogic;
        }());
        Business.IndexDbLogic = IndexDbLogic;
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
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
            //public methods
            function Table(name, columns, version) {
                this.Name = "";
                this.Columns = [];
                this.RequireDelete = false;
                this.RequireCreation = false;
                this.PrimaryKey = "";
                this.Name = name;
                var That = this;
                columns.forEach(function (item) {
                    That.Columns.push(new Model.Column(item));
                });
                this.setRequireDelete();
                this.setDbVersion(version);
                this.setPrimaryKey();
            }
            //private methods
            Table.prototype.setPrimaryKey = function () {
                //this.Key = new Column();//
                var That = this;
                this.Columns.every(function (item) {
                    if (item.Primarykey) {
                        That.PrimaryKey = item.Name;
                        return false;
                    }
                    return true;
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
            Table.prototype.setDbVersion = function (dbVersion) {
                if (dbVersion == null) {
                    localStorage.setItem('JsStorage_Db_Version', '1');
                }
                else if (dbVersion > Number(localStorage.getItem('JsStorage_Db_Version'))) {
                    localStorage.setItem('JsStorage_Db_Version', dbVersion.toString());
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
            function DataBase(tables) {
                this.Name = "JsStorage";
                this.Tables = [];
                this.Tables = tables;
            }
            return DataBase;
        }());
        Model.DataBase = DataBase;
    })(Model = JsStorage.Model || (JsStorage.Model = {}));
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
        Main.prototype.createDb = function (dataBase) {
            if (JsStorage.DbType == JsStorage.DBType.IndexedDb) {
                JsStorage.IndexDbObj = new JsStorage.Business.IndexDbLogic();
                var DbVersion = Number(localStorage.getItem('JsStorage_Db_Version'));
                JsStorage.IndexDbObj.openDataBase(DbVersion, dataBase);
            }
            else {
                JsStorage.WebSqlObj = new JsStorage.Business.WebSqlLogic();
            }
        };
        return Main;
    }());
    JsStorage.Main = Main;
})(JsStorage || (JsStorage = {}));
/// <reference path="Business/CommonLogic.ts" />
/// <reference path="Business/IndexDbLogic.ts" />
/// <reference path="Model/Column.ts" />
/// <reference path="Model/Table.ts" />
/// <reference path="Model/DataBase.ts" />
/// <reference path="Business/MainLogic.ts" />
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
//# sourceMappingURL=jsStorage.js.map