var JsStorage;
(function (JsStorage) {
    var DBType;
    (function (DBType) {
        DBType[DBType["IndexedDb"] = 0] = "IndexedDb";
        DBType[DBType["WebSql"] = 1] = "WebSql";
    })(DBType = JsStorage.DBType || (JsStorage.DBType = {}));
    ;
    var ErrorType;
    (function (ErrorType) {
        ErrorType[ErrorType["UndefinedColumn"] = 0] = "UndefinedColumn";
        ErrorType[ErrorType["UndefinedValue"] = 1] = "UndefinedValue";
        ErrorType[ErrorType["UndefinedColumnName"] = 2] = "UndefinedColumnName";
        ErrorType[ErrorType["UndefinedColumnValue"] = 3] = "UndefinedColumnValue";
        ErrorType[ErrorType["NotArray"] = 4] = "NotArray";
        ErrorType[ErrorType["NoValueSupplied"] = 5] = "NoValueSupplied";
    })(ErrorType = JsStorage.ErrorType || (JsStorage.ErrorType = {}));
    function convertintoLowerCase(obj) {
        for (var key in obj) {
            obj[key] = obj[key].toLowerCase();
        }
    }
    JsStorage.convertintoLowerCase = convertintoLowerCase;
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var UtilityLogic = (function () {
            function UtilityLogic() {
            }
            UtilityLogic.getError = function (errorType, errorDetail) {
                var Error = {
                    Name: JsStorage.ErrorType[errorType],
                    Value: ''
                };
                switch (errorType) {
                    case JsStorage.ErrorType.NotArray:
                        Error.Value = "Supplied value is not an array";
                        break;
                    case JsStorage.ErrorType.UndefinedColumn:
                        Error.Value = "Column is undefined in Where";
                        break;
                    case JsStorage.ErrorType.UndefinedValue:
                        Error.Value = "Value is undefined in Where";
                        break;
                    case JsStorage.ErrorType.UndefinedColumnName:
                        Error.Value = "column name is undefined";
                        break;
                    case JsStorage.ErrorType.UndefinedColumnValue:
                        Error.Value = "column value is undefined";
                        break;
                    case JsStorage.ErrorType.NoValueSupplied:
                        Error.Value = "no value supplied";
                        break;
                }
                return Error;
            };
            return UtilityLogic;
        }());
        Business.UtilityLogic = UtilityLogic;
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Model;
    (function (Model) {
        var Column = (function () {
            function Column(key, tableName) {
                if (key.Name != null) {
                    this.Name = key.Name.toLowerCase();
                }
                else {
                    throw "Column Name is not defined for table:" + tableName;
                }
                this.AutoIncrement = key.AutoIncrement != null ? key.AutoIncrement : false;
                this.PrimaryKey = key.PrimaryKey != null ? key.PrimaryKey : false;
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
                table.Columns.forEach(function (item) {
                    That.Columns.push(new Model.Column(item, table.Name));
                });
                this.setRequireDelete(dbName);
                this.setDbVersion(dbName);
                this.setPrimaryKey();
            }
            //private methods
            Table.prototype.setPrimaryKey = function () {
                //this.Key = new Column();//
                var That = this;
                this.Columns.forEach(function (item) {
                    if (item.PrimaryKey && That.PrimaryKey.length == 0) {
                        That.PrimaryKey = item.Name;
                        localStorage.setItem("JsStorage_" + That.Name + "_" + item.Name, "true");
                    }
                    else if (item.PrimaryKey && That.PrimaryKey.length > 0) {
                        localStorage.setItem("JsStorage_" + That.Name + "_" + item.Name, "");
                        throw "Multiple primary key are not allowed";
                    }
                });
            };
            Table.prototype.setRequireDelete = function (dbName) {
                var TableVersion = localStorage.getItem("JsStorage_" + dbName + "_" + this.Name);
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
                            item.RequireDelete = true;
                            if (item.RequireDelete) {
                                // Delete the old datastore.    
                                if (db.objectStoreNames.contains(item.Name)) {
                                    db.deleteObjectStore(item.Name);
                                }
                                createObjectStore(db, item);
                            }
                            else if (item.RequireCreation) {
                                createObjectStore(db, item);
                            }
                        });
                    };
                    var createObjectStore = function (dbConnection, item) {
                        try {
                            if (item.PrimaryKey.length > 0) {
                                var Store = dbConnection.createObjectStore(item.Name, {
                                    keyPath: item.PrimaryKey
                                });
                                item.Columns.forEach(function (column) {
                                    if (!column.PrimaryKey) {
                                        Store.createIndex(column.Name, column.Name, { unique: false });
                                    }
                                });
                            }
                            else {
                                var Store = dbConnection.createObjectStore(item.Name, {
                                    autoIncrement: true
                                });
                                item.Columns.forEach(function (column) {
                                    Store.createIndex(column.Name, column.Name, { unique: false });
                                });
                            }
                            localStorage.setItem("JsStorage_" + That.ActiveDataBase.Name + "_" + item.Name, item.Version.toString());
                        }
                        catch (e) {
                            console.error(e);
                        }
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
            IndexDbLogic.prototype.dropDb = function (name, onSuccess, onError) {
                var DbDeleteRequest = window.indexedDB.deleteDatabase(name);
                DbDeleteRequest.onsuccess = function () {
                    if (onSuccess != null) {
                        onSuccess();
                    }
                };
                DbDeleteRequest.onerror = function (e) {
                    if (onError != null) {
                        onError(event.target.error);
                    }
                };
            };
            IndexDbLogic.prototype.select = function (query, onSuccess, onError) {
                var That = this, ErrorOccured = false, ErrorCount = 0, Transaction = That.DbConnection.transaction([query.From], "readonly"), ObjectStore = Transaction.objectStore(query.From);
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
                                throw "Column is undefined in Case for tableName:" + query.From;
                            }
                            else if (item.Value == undefined) {
                                throw "Column value is undefined in Case for Column Name:" + item.Column + "for tableName:" + query.From;
                            }
                            else {
                                if (That.isPrimaryKey(query.From, item)) {
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
                var That = this, Transaction = That.DbConnection.transaction([query.Table.toLowerCase()], "readwrite"), ObjectStore = Transaction.objectStore(query.Table), ErrorOccured = false, ErrorCount = 0, RowAffected = 0;
                if (query.Where == undefined) {
                    var CursorOpenRequest = ObjectStore.openCursor(), Results = [];
                    CursorOpenRequest.onsuccess = function (e) {
                        var Cursor = e.target.result;
                        if (Cursor) {
                            Cursor.delete();
                            ++RowAffected;
                            Cursor.continue();
                        }
                        else {
                            onSuceessRequest(RowAffected);
                        }
                    };
                    CursorOpenRequest.onerror = onErrorGetRequest;
                }
                else {
                    query.Where.every(function (condition, index) {
                        if (!ErrorOccured) {
                            if (condition.Column == undefined) {
                                throw "Column is undefined in Case for tableName:" + query.Table;
                            }
                            else if (condition.Value == undefined) {
                                throw "Column value is undefined in Case for Column Name:" + condition.Column + "for tableName:" + query.Table;
                            }
                            else {
                                if (That.isPrimaryKey(query.Table, condition)) {
                                    var GetRequest = ObjectStore.get(condition.Value);
                                    GetRequest.onsuccess = function (event) {
                                        var Result = event.target.result;
                                        var DelteRequest = ObjectStore.delete(Result);
                                        DelteRequest.onsuccess = function () {
                                            ++ExecutionNo;
                                            ++RowAffected;
                                            if (ExecutionNo == query.Where.length) {
                                                onSuceessRequest(RowAffected);
                                            }
                                        };
                                        DelteRequest.onerror = function (e) {
                                            ErrorOccured = true;
                                            ++ErrorCount;
                                            onErrorGetRequest(e);
                                        };
                                    };
                                    GetRequest.onerror = function (e) {
                                        ErrorOccured = true;
                                        ++ErrorCount;
                                        onErrorGetRequest(e);
                                    };
                                }
                                else {
                                    var CursorOpenRequest = ObjectStore.index(condition.Column).openCursor(IDBKeyRange.only(condition.Value)), ExecutionNo = 0;
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor = e.target.result;
                                        if (Cursor) {
                                            Cursor.delete();
                                            ++RowAffected;
                                            Cursor.continue();
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
                    if (onError != null) {
                        onError(e.target.error);
                    }
                };
            };
            IndexDbLogic.prototype.update = function (query, onSuccess, onError) {
                var That = this, ErrorOccured = false, ErrorCount = 0, RowAffected = 0, Transaction = That.DbConnection.transaction([query.Table.toLowerCase()], "readwrite"), ObjectStore = Transaction.objectStore(query.Table);
                if (query.Where == undefined) {
                    var CursorOpenRequest = ObjectStore.openCursor();
                    CursorOpenRequest.onsuccess = function (e) {
                        var Cursor = e.target.result;
                        if (Cursor) {
                            for (var key in query.Set) {
                                Cursor.value[key] = query.Set[key];
                            }
                            Cursor.update(Cursor.value);
                            ++RowAffected;
                            Cursor.continue();
                        }
                        else {
                            onSuceessRequest(RowAffected);
                        }
                    };
                    CursorOpenRequest.onerror = onErrorGetRequest;
                }
                else {
                    query.Where.every(function (condition, index) {
                        if (!ErrorOccured) {
                            var Error = That.convertWhereIntoLowerCase(condition);
                            if (JsStorage.ErrorType != null) {
                                var ErrorObj = {
                                    target: {
                                        error: null
                                    }
                                };
                                if (Error == JsStorage.ErrorType.UndefinedColumn) {
                                    ErrorObj.target.error = Business.UtilityLogic.getError(Error, null);
                                }
                                else if (Error == JsStorage.ErrorType.UndefinedValue) {
                                    ErrorObj.target.error = Business.UtilityLogic.getError(Error, null);
                                }
                                ErrorOccured = true;
                                ++ErrorCount;
                                onErrorGetRequest(ErrorObj);
                            }
                            else {
                                if (That.isPrimaryKey(query.Table, condition)) {
                                    var GetRequest = ObjectStore.get(condition.Value);
                                    GetRequest.onsuccess = function (event) {
                                        var Result = event.target.result;
                                        var UpdateRequest = ObjectStore.put(Result);
                                        UpdateRequest.onsuccess = function () {
                                            ++ExecutionNo;
                                            ++RowAffected;
                                            if (ExecutionNo == query.Where.length) {
                                                onSuceessRequest(RowAffected);
                                            }
                                        };
                                        UpdateRequest.onerror = function (e) {
                                            ErrorOccured = true;
                                            ++ErrorCount;
                                            onErrorGetRequest(e);
                                        };
                                    };
                                    GetRequest.onerror = function (e) {
                                        ErrorOccured = true;
                                        ++ErrorCount;
                                        onErrorGetRequest(e);
                                    };
                                }
                                else {
                                    // var GetRequest = ObjectStore.index(item.Column);
                                    var CursorOpenRequest = ObjectStore.index(condition.Column).openCursor(IDBKeyRange.only(condition.Value)), ExecutionNo = 0;
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor = e.target.result;
                                        if (Cursor) {
                                            for (var key in query.Set) {
                                                Cursor.value[key] = query.Set[key];
                                            }
                                            Cursor.update(Cursor.value);
                                            ++RowAffected;
                                            Cursor.continue();
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
            IndexDbLogic.prototype.insert = function (tableName, values, onSuccess, onError) {
                try {
                    tableName = tableName.toLowerCase();
                    var TotalRowsAffected = 0, Store = this.DbConnection.transaction([tableName], "readwrite").objectStore(tableName);
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
                catch (ex) {
                    console.error(ex);
                }
            };
            IndexDbLogic.prototype.isPrimaryKey = function (tablename, condition) {
                var IsPrimaryKey = false;
                this.ActiveDataBase.Tables.every(function (table) {
                    if (table.Name == tablename) {
                        table.Columns.every(function (column) {
                            if (column.PrimaryKey) {
                                IsPrimaryKey = true;
                                return true;
                            }
                            return false;
                        });
                    }
                    return false;
                });
                return IsPrimaryKey;
                //return localStorage.getItem("JsStorage_" + tablename + "_" + condition.Column).toLowerCase() == "true" ? true : false
            };
            IndexDbLogic.prototype.convertWhereIntoLowerCase = function (condition) {
                if (condition.Column == undefined) {
                    return JsStorage.ErrorType.UndefinedColumn;
                }
                else if (condition.Value == undefined) {
                    return JsStorage.ErrorType.UndefinedValue;
                }
                else {
                    condition.Column = condition.Column.toLowerCase();
                    condition.Op = condition.Op.toLowerCase();
                }
                return null;
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
        Main.prototype.dropDb = function (name, onSuccess, onError) {
            if (this.DbType == JsStorage.DBType.IndexedDb) {
                this.IndexDbObj.dropDb(name.toLowerCase(), onSuccess, onError);
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
        Main.prototype.select = function (query, onSuccess, onError) {
            query.From = query.From.toLowerCase();
            if (this.Status.ConStatus == ConnectionStatus.Connected) {
                query.From = query.From.toLowerCase();
                if (this.DbType == JsStorage.DBType.IndexedDb) {
                    this.IndexDbObj.select(query, onSuccess, onError);
                }
                else {
                }
            }
            else if (this.Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.select(query, onSuccess, onError);
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
            if (!Array.isArray(query.Values)) {
                throw "Value should be array :- supplied value is not array";
            }
            else if (query.Values.length > 0) {
                query.Into = query.Into.toLowerCase();
                this.convertValueIntoLowerCase(query.Values);
                if (this.DbType == JsStorage.DBType.IndexedDb) {
                    this.IndexDbObj.insert(query.Into, query.Values, onSuccess, onError);
                }
                else {
                }
            }
            else {
                if (onError != null) {
                    onError(JsStorage.Business.UtilityLogic.getError(JsStorage.ErrorType.NoValueSupplied, null));
                }
            }
        };
        Main.prototype.update = function (query, onSuccess, onError) {
            JsStorage.convertintoLowerCase(query.Set);
            this.convertValueIntoLowerCase(query.Where);
            if (this.DbType == JsStorage.DBType.IndexedDb) {
                this.IndexDbObj.update(query, onSuccess, onError);
            }
            else {
            }
        };
        Main.prototype.delete = function () {
        };
        Main.prototype.convertValueIntoLowerCase = function (values) {
            values.forEach(function (value) {
                value.Column = value.Column.toLowerCase();
            });
        };
        return Main;
    }());
    JsStorage.Main = Main;
})(JsStorage || (JsStorage = {}));
/// <reference path="Business/CommonLogic.ts" />
/// <reference path="Business/UtilityLogic.ts" />
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
//# sourceMappingURL=JsStorage.js.map