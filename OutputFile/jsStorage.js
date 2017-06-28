var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var JsStore;
(function (JsStore) {
    var ErrorType;
    (function (ErrorType) {
        ErrorType[ErrorType["UndefinedColumn"] = 0] = "UndefinedColumn";
        ErrorType[ErrorType["UndefinedValue"] = 1] = "UndefinedValue";
        ErrorType[ErrorType["UndefinedColumnName"] = 2] = "UndefinedColumnName";
        ErrorType[ErrorType["UndefinedColumnValue"] = 3] = "UndefinedColumnValue";
        ErrorType[ErrorType["NotArray"] = 4] = "NotArray";
        ErrorType[ErrorType["NoValueSupplied"] = 5] = "NoValueSupplied";
        ErrorType[ErrorType["ColumnNotExist"] = 6] = "ColumnNotExist";
        ErrorType[ErrorType["InvalidOp"] = 7] = "InvalidOp";
        ErrorType[ErrorType["NullValue"] = 8] = "NullValue";
        ErrorType[ErrorType["BadDataType"] = 9] = "BadDataType";
        ErrorType[ErrorType["NextJoinNotExist"] = 10] = "NextJoinNotExist";
        ErrorType[ErrorType["TableNotExist"] = 11] = "TableNotExist";
    })(ErrorType = JsStore.ErrorType || (JsStore.ErrorType = {}));
    var ConnectionStatus;
    (function (ConnectionStatus) {
        ConnectionStatus[ConnectionStatus["Connected"] = 1] = "Connected";
        ConnectionStatus[ConnectionStatus["Closed"] = 2] = "Closed";
        ConnectionStatus[ConnectionStatus["NotStarted"] = 3] = "NotStarted";
    })(ConnectionStatus = JsStore.ConnectionStatus || (JsStore.ConnectionStatus = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var DbHelperLogic = (function () {
        function DbHelperLogic() {
            this.doJoin = function (type, column1, data1, column2, data2) {
                switch (type) {
                    case 'inner': return data1[column1] == data2[column2];
                }
            };
            this.doInner = function (query1, data1, query2, data2) {
                if (data1[query1.Column] == data2[query2.Column]) {
                    this.Results.push((query1.Table = data1[0], data1), (query2.Table = data2[0], data2));
                }
            };
        }
        DbHelperLogic.prototype.and = function () {
            return this;
        };
        DbHelperLogic.prototype.or = function () {
            return this;
        };
        return DbHelperLogic;
    }());
    JsStore.DbHelperLogic = DbHelperLogic;
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var UtilityLogic = (function () {
        function UtilityLogic() {
        }
        UtilityLogic.getError = function (errorType, logError, errorDetail) {
            if (logError === void 0) { logError = false; }
            var Error = {
                Name: JsStore.ErrorType[errorType],
                Value: ''
            };
            switch (errorType) {
                case JsStore.ErrorType.NotArray:
                    Error.Value = "Supplied value is not an array";
                    break;
                case JsStore.ErrorType.UndefinedColumn:
                    Error.Value = "Column is undefined in Where";
                    break;
                case JsStore.ErrorType.UndefinedValue:
                    Error.Value = "Value is undefined in Where";
                    break;
                case JsStore.ErrorType.UndefinedColumnName:
                    Error.Value = "Column name is undefined";
                    break;
                case JsStore.ErrorType.UndefinedColumnValue:
                    Error.Value = "Column value is undefined";
                    break;
                case JsStore.ErrorType.NoValueSupplied:
                    Error.Value = "No value supplied";
                    break;
                case JsStore.ErrorType.InvalidOp:
                    Error.Value = "Invalid Op Value '" + errorDetail['Op'] + "'";
                    break;
                case JsStore.ErrorType.ColumnNotExist:
                    Error.Value = "Column '" + errorDetail['ColumnName'] + "' does not exist";
                    break;
                case JsStore.ErrorType.NullValue:
                    Error.Value = "Null value is not allowed for column '" + errorDetail['ColumnName'] + "'";
                    break;
                case JsStore.ErrorType.BadDataType:
                    Error.Value = "Supplied value for column '" + errorDetail['ColumnName'] + "' does not have valid type";
                    break;
                case JsStore.ErrorType.NextJoinNotExist:
                    Error.Value = "Next join details not supplied";
                    break;
                case JsStore.ErrorType.TableNotExist:
                    Error.Value = "Table '" + errorDetail['TableName'] + "' does not exist";
                    ;
                    break;
                default: console.warn('the error type is not defined');
            }
            if (logError) {
                console.warn("JsStorage Error :- " + Error.Value);
            }
            return Error;
        };
        UtilityLogic.convertObjectintoLowerCase = function (obj) {
            var keys = Object.keys(obj);
            var n = keys.length;
            while (n--) {
                var key = keys[n];
                obj[key.toLowerCase()] = obj[key];
                delete obj[key];
            }
        };
        return UtilityLogic;
    }());
    /**
     * determine and set the DataBase Type
     *
     *
     * @memberOf MainLogic
     */
    UtilityLogic.setDbType = function () {
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        if (indexedDB) {
            window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
            window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
        }
    };
    JsStore.UtilityLogic = UtilityLogic;
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var KeyStores;
    (function (KeyStores) {
        var Model;
        (function (Model) {
            var Column = (function () {
                function Column(key, tableName) {
                    if (key.Name != null) {
                        this.Name = key.Name;
                    }
                    else {
                        throw "Column Name is not defined for table:" + tableName;
                    }
                    this.AutoIncrement = key.AutoIncrement != null ? key.AutoIncrement : false;
                    this.PrimaryKey = key.PrimaryKey != null ? key.PrimaryKey : false;
                    this.Unique = key.Unique != null ? key.Unique : false;
                    this.CurrentDate = key.CurrentDate != null ? key.CurrentDate : false;
                    this.NotNull = key.NotNull != null ? key.NotNull : false;
                    this.DataType = key.DataType != null ? key.DataType : '';
                }
                return Column;
            }());
            Model.Column = Column;
        })(Model = KeyStores.Model || (KeyStores.Model = {}));
    })(KeyStores = JsStore.KeyStores || (JsStore.KeyStores = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var KeyStores;
    (function (KeyStores) {
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
                    this.Name = table.Name;
                    this.Version = table.Version == undefined ? 1 : table.Version;
                    var That = this;
                    table.Columns.forEach(function (item) {
                        That.Columns.push(new Model.Column(item, table.Name));
                    });
                    this.setRequireDelete(dbName);
                    this.setPrimaryKey();
                }
                //private methods
                Table.prototype.setPrimaryKey = function () {
                    //this.Key = new Column();//
                    var That = this, Length = this.Columns.length;
                    this.Columns.forEach(function (item, index) {
                        if (item.PrimaryKey && That.PrimaryKey.length == 0) {
                            That.PrimaryKey = item.Name;
                        }
                    });
                };
                Table.prototype.setRequireDelete = function (dbName) {
                    this.RequireDelete = true;
                };
                return Table;
            }());
            Model.Table = Table;
        })(Model = KeyStores.Model || (KeyStores.Model = {}));
    })(KeyStores = JsStore.KeyStores || (JsStore.KeyStores = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var KeyStores;
    (function (KeyStores) {
        var Model;
        (function (Model) {
            var DataBase = (function () {
                function DataBase(dataBase) {
                    this.Tables = [];
                    var That = this;
                    this.Name = dataBase.Name;
                    dataBase.Tables.forEach(function (item) {
                        That.Tables.push(new Model.Table(item, That.Name));
                    });
                }
                return DataBase;
            }());
            Model.DataBase = DataBase;
        })(Model = KeyStores.Model || (KeyStores.Model = {}));
    })(KeyStores = JsStore.KeyStores || (JsStore.KeyStores = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var KeyStores;
    (function (KeyStores) {
        var Business;
        (function (Business) {
            var CreateDbLogic = (function () {
                function CreateDbLogic() {
                    var That = this, DbRequest = window.indexedDB.open(Business.ActiveDataBase.Name, Business.DbVersion);
                    DbRequest.onerror = function (event) {
                        console.error(event.target.error);
                    };
                    DbRequest.onsuccess = function (event) {
                        Business.Status.ConStatus = JsStore.ConnectionStatus.Connected;
                        Business.DbConnection = DbRequest.result;
                        Business.DbConnection.onclose = function () {
                            Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                            Business.Status.LastError = "Connection Closed";
                        };
                        Business.DbConnection.onversionchange = function (e) {
                            if (e.newVersion === null) {
                                e.target.close(); // Manually close our connection to the db
                            }
                        };
                        Business.DbConnection.onerror = function (e) {
                            Business.Status.LastError = "Error occured in connection :" + e.target.result;
                        };
                        Business.DbConnection.onabort = function (e) {
                            Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                            Business.Status.LastError = "Connection aborted";
                        };
                    };
                    DbRequest.onupgradeneeded = function (event) {
                        var db = event.target.result;
                        Business.ActiveDataBase.Tables.forEach(function (item) {
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
                                    if (column.PrimaryKey) {
                                        Store.createIndex(column.Name, column.Name, { unique: true });
                                    }
                                    else {
                                        Store.createIndex(column.Name, column.Name, { unique: false });
                                    }
                                });
                            }
                            else {
                                var Store = dbConnection.createObjectStore(item.Name, {
                                    autoIncrement: true
                                });
                                item.Columns.forEach(function (column) {
                                    if (column.Unique) {
                                        Store.createIndex(column.Name, column.Name, { unique: true });
                                    }
                                    else {
                                        Store.createIndex(column.Name, column.Name, { unique: false });
                                    }
                                });
                            }
                        }
                        catch (e) {
                            console.error(e);
                        }
                    };
                }
                return CreateDbLogic;
            }());
            Business.CreateDbLogic = CreateDbLogic;
        })(Business = KeyStores.Business || (KeyStores.Business = {}));
    })(KeyStores = JsStore.KeyStores || (JsStore.KeyStores = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var KeyStores;
    (function (KeyStores) {
        var Business;
        (function (Business) {
            var RemoveLogic = (function () {
                function RemoveLogic(query, onSuccess, onError) {
                    var That = this, Transaction = Business.DbConnection.transaction([query.From], "readwrite"), ObjectStore = Transaction.objectStore(query.From), ErrorOccured = false, ErrorCount = 0, RowAffected = 0, onErrorGetRequest = function (e) {
                        ++ErrorCount;
                        if (onError != null && this.ErrorCount == 1) {
                            onError(e.target.error);
                        }
                        console.error(e);
                    };
                    Transaction.oncomplete = function () {
                        if (onSuccess != null) {
                            onSuccess(RowAffected);
                        }
                    };
                    Transaction.onerror = onErrorGetRequest;
                    var Column, ExecutionNo = 0, ConditionLength = Object.keys(query.Where).length;
                    for (Column in query.Where) {
                        if (!ErrorOccured) {
                            var CursorOpenRequest = ObjectStore.index(Column).openCursor(IDBKeyRange.only(query.Where[Column])), ExecutionNo = 0;
                            CursorOpenRequest.onerror = function (e) {
                                ErrorOccured = true;
                                onErrorGetRequest(e);
                            };
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor) {
                                    Cursor.delete();
                                    ++RowAffected;
                                    Cursor.continue();
                                }
                            };
                        }
                        else {
                            return;
                        }
                    }
                }
                return RemoveLogic;
            }());
            Business.RemoveLogic = RemoveLogic;
        })(Business = KeyStores.Business || (KeyStores.Business = {}));
    })(KeyStores = JsStore.KeyStores || (JsStore.KeyStores = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var KeyStores;
    (function (KeyStores) {
        var Business;
        (function (Business) {
            var SetLogic = (function () {
                function SetLogic(tableName, value, isReturn, onSuccess, onError) {
                    this.ErrorOccured = false;
                    this.ErrorCount = 0;
                    this.onErrorRequest = function (e, customError) {
                        if (customError === void 0) { customError = false; }
                        ++this.ErrorCount;
                        if (this.ErrorCount == 1) {
                            if (this.OnError != null) {
                                if (!customError) {
                                    this.OnError(e.target.error, this.TotalRowsAffected);
                                }
                                else {
                                    this.OnError(e, this.TotalRowsAffected);
                                }
                            }
                        }
                        console.error(e);
                    };
                    try {
                        this.OnSuccess = onSuccess;
                        this.OnError = onError;
                        var That = this, Updated = false;
                        var UpdateIfExist = function () {
                            var Transaction = Business.DbConnection.transaction([tableName], "readwrite");
                            That.Store = Transaction.objectStore(tableName);
                            Transaction.oncomplete = function (e) {
                                if (Updated) {
                                    if (onSuccess != null) {
                                        onSuccess();
                                    }
                                }
                                else {
                                    SetData();
                                }
                            };
                            var CursorOpenRequest = That.Store.index('Key').openCursor(IDBKeyRange.only(value['Key']));
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor) {
                                    Updated = true;
                                    Cursor.value['Value'] = value['Value'];
                                    Cursor.update(Cursor.value);
                                }
                            };
                            CursorOpenRequest.onerror = function (e) {
                                That.ErrorOccured = true;
                                That.onErrorRequest(e);
                            };
                        };
                        var SetData = function () {
                            var Transaction = Business.DbConnection.transaction([tableName], "readwrite");
                            That.Store = Transaction.objectStore(tableName);
                            Transaction.oncomplete = function (e) {
                                if (onSuccess != null) {
                                    onSuccess();
                                }
                            };
                            var AddResult = That.Store.add(value);
                            AddResult.onerror = function (e) {
                                That.onErrorRequest(e);
                            };
                        };
                        UpdateIfExist();
                    }
                    catch (ex) {
                        console.error(ex);
                    }
                }
                return SetLogic;
            }());
            Business.SetLogic = SetLogic;
        })(Business = KeyStores.Business || (KeyStores.Business = {}));
    })(KeyStores = JsStore.KeyStores || (JsStore.KeyStores = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var KeyStores;
    (function (KeyStores) {
        var Business;
        (function (Business) {
            var OpenDbLogic = (function () {
                function OpenDbLogic(objMain, onSuccess, onError) {
                    if (Business.Status.ConStatus != JsStore.ConnectionStatus.Connected) {
                        if (Business.ActiveDataBase.Name.length > 0) {
                            var DbRequest = window.indexedDB.open(Business.ActiveDataBase.Name, Business.DbVersion), That = this;
                            DbRequest.onerror = function (event) {
                                if (onError != null) {
                                    onError(event.target.error);
                                }
                            };
                            DbRequest.onsuccess = function (event) {
                                Business.Status.ConStatus = JsStore.ConnectionStatus.Connected;
                                Business.DbConnection = DbRequest.result;
                                Business.DbConnection.onclose = function () {
                                    Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                                    Business.Status.LastError = "Connection Closed, trying to reconnect";
                                };
                                Business.DbConnection.onversionchange = function (e) {
                                    if (e.newVersion === null) {
                                        e.target.close(); // Manually close our connection to the db
                                    }
                                };
                                Business.DbConnection.onerror = function (e) {
                                    Business.Status.LastError = "Error occured in connection :" + e.target.result;
                                };
                                Business.DbConnection.onabort = function (e) {
                                    Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                                    Business.Status.LastError = "Connection Aborted";
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
                }
                return OpenDbLogic;
            }());
            Business.OpenDbLogic = OpenDbLogic;
        })(Business = KeyStores.Business || (KeyStores.Business = {}));
    })(KeyStores = JsStore.KeyStores || (JsStore.KeyStores = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var KeyStores;
    (function (KeyStores) {
        var Business;
        (function (Business) {
            var BaseGetLogic = (function () {
                function BaseGetLogic() {
                    this.ErrorOccured = false;
                    this.ErrorCount = 0;
                    this.onErrorRequest = function (e) {
                        ++this.ErrorCount;
                        if (this.ErrorCount == 1) {
                            if (this.OnError != null) {
                                this.OnError(e.target.error);
                            }
                        }
                        console.error(e);
                    };
                }
                return BaseGetLogic;
            }());
            Business.BaseGetLogic = BaseGetLogic;
        })(Business = KeyStores.Business || (KeyStores.Business = {}));
    })(KeyStores = JsStore.KeyStores || (JsStore.KeyStores = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var KeyStores;
    (function (KeyStores) {
        var Business;
        (function (Business) {
            var GetLogic = (function (_super) {
                __extends(GetLogic, _super);
                function GetLogic(query, onSuccess, onError) {
                    var _this = _super.call(this) || this;
                    _this.executeWhereLogic = function () {
                        var Column, That = this;
                        var executeInnerWhereLogic = function (column, value) {
                            var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                            CursorOpenRequest.onerror = function (e) {
                                That.ErrorOccured = true;
                                That.onErrorRequest(e);
                            };
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor) {
                                    That.Results = Cursor.value['Value'];
                                }
                            };
                        };
                        for (Column in this.Query.Where) {
                            executeInnerWhereLogic(Column, this.Query.Where[Column]);
                            break;
                        }
                    };
                    var That = _this;
                    _this.Query = query;
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    _this.Transaction = Business.DbConnection.transaction([query.From], "readonly");
                    _this.Transaction.oncomplete = function (e) {
                        if (onSuccess != null) {
                            onSuccess(That.Results);
                        }
                    };
                    _this.ObjectStore = _this.Transaction.objectStore(query.From);
                    _this.executeWhereLogic();
                    return _this;
                }
                return GetLogic;
            }(Business.BaseGetLogic));
            Business.GetLogic = GetLogic;
        })(Business = KeyStores.Business || (KeyStores.Business = {}));
    })(KeyStores = JsStore.KeyStores || (JsStore.KeyStores = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var KeyStores;
    (function (KeyStores) {
        var Business;
        (function (Business) {
            Business.DbVersion = 1, Business.Status = {
                ConStatus: JsStore.ConnectionStatus.NotStarted,
                LastError: ""
            };
            var MainLogic = (function () {
                function MainLogic(dataBase) {
                    this.openDb = function (objMain, onSuccess, onError) {
                        var ObjOpenDb = new Business.OpenDbLogic(objMain, onSuccess, onError);
                    };
                    this.closeDb = function () {
                        if (Business.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                            Business.DbConnection.close();
                        }
                    };
                    this.set = function (tableName, value, isReturn, onSuccess, onError) {
                        var ObjInsert = new Business.SetLogic(tableName, value, isReturn, onSuccess, onError);
                    };
                    this.remove = function (query, onSuccess, onError) {
                        var ObjDelete = new Business.RemoveLogic(query, onSuccess, onError);
                    };
                    this.get = function (query, onSuccess, onError) {
                        new Business.GetLogic(query, onSuccess, onError);
                    };
                    this.createDb = function () {
                        new Business.CreateDbLogic();
                    };
                    Business.ActiveDataBase = dataBase;
                }
                return MainLogic;
            }());
            Business.MainLogic = MainLogic;
        })(Business = KeyStores.Business || (KeyStores.Business = {}));
    })(KeyStores = JsStore.KeyStores || (JsStore.KeyStores = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var IndexDb;
    (function (IndexDb) {
        var Model;
        (function (Model) {
            var Column = (function () {
                function Column(key, tableName) {
                    if (key.Name != null) {
                        this.Name = key.Name;
                    }
                    else {
                        throw "Column Name is not defined for table:" + tableName;
                    }
                    this.AutoIncrement = key.AutoIncrement != null ? key.AutoIncrement : false;
                    this.PrimaryKey = key.PrimaryKey != null ? key.PrimaryKey : false;
                    this.Unique = key.Unique != null ? key.Unique : false;
                    this.CurrentDate = key.CurrentDate != null ? key.CurrentDate : false;
                    this.NotNull = key.NotNull != null ? key.NotNull : false;
                    this.DataType = key.DataType != null ? key.DataType : '';
                }
                return Column;
            }());
            Model.Column = Column;
        })(Model = IndexDb.Model || (IndexDb.Model = {}));
    })(IndexDb = JsStore.IndexDb || (JsStore.IndexDb = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var IndexDb;
    (function (IndexDb) {
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
                    this.Name = table.Name;
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
                    var That = this, Length = this.Columns.length;
                    this.Columns.forEach(function (item, index) {
                        if (item.PrimaryKey && That.PrimaryKey.length == 0) {
                            That.PrimaryKey = item.Name;
                            localStorage.setItem("JsStorage_" + That.Name + "_" + item.Name, "true");
                        }
                        else if (item.PrimaryKey && That.PrimaryKey.length > 0) {
                            localStorage.setItem("JsStorage_" + That.Name + "_" + item.Name, "");
                            throw "Multiple primary key are not allowed";
                        }
                        // else if (index == Length && That.PrimaryKey.length == 0) {
                        // }
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
        })(Model = IndexDb.Model || (IndexDb.Model = {}));
    })(IndexDb = JsStore.IndexDb || (JsStore.IndexDb = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var IndexDb;
    (function (IndexDb) {
        var Model;
        (function (Model) {
            var DataBase = (function () {
                function DataBase(dataBase) {
                    this.Tables = [];
                    var That = this;
                    this.Name = dataBase.Name;
                    dataBase.Tables.forEach(function (item) {
                        That.Tables.push(new Model.Table(item, That.Name));
                    });
                }
                return DataBase;
            }());
            Model.DataBase = DataBase;
        })(Model = IndexDb.Model || (IndexDb.Model = {}));
    })(IndexDb = JsStore.IndexDb || (JsStore.IndexDb = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var IndexDb;
    (function (IndexDb) {
        var Business;
        (function (Business) {
            var CreateDbLogic = (function () {
                function CreateDbLogic(objMain, onSuccess, onError) {
                    var That = this, DbVersion = Number(localStorage.getItem(Business.ActiveDataBase.Name + 'Db_Version')), DbRequest = window.indexedDB.open(Business.ActiveDataBase.Name, DbVersion);
                    DbRequest.onerror = function (event) {
                        if (onError != null) {
                            onError(event.target.error);
                        }
                    };
                    DbRequest.onsuccess = function (event) {
                        Business.Status.ConStatus = JsStore.ConnectionStatus.Connected;
                        Business.DbConnection = DbRequest.result;
                        Business.DbConnection.onclose = function () {
                            Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                            Business.Status.LastError = "Connection Closed";
                        };
                        Business.DbConnection.onversionchange = function (e) {
                            if (e.newVersion === null) {
                                e.target.close(); // Manually close our connection to the db
                            }
                        };
                        Business.DbConnection.onerror = function (e) {
                            Business.Status.LastError = "Error occured in connection :" + e.target.result;
                        };
                        Business.DbConnection.onabort = function (e) {
                            Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                            Business.Status.LastError = "Connection aborted";
                        };
                        if (onSuccess != null) {
                            onSuccess(objMain);
                        }
                    };
                    DbRequest.onupgradeneeded = function (event) {
                        var db = event.target.result;
                        Business.ActiveDataBase.Tables.forEach(function (item) {
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
                                    if (column.PrimaryKey) {
                                        Store.createIndex(column.Name, column.Name, { unique: true });
                                    }
                                    else {
                                        Store.createIndex(column.Name, column.Name, { unique: false });
                                    }
                                });
                            }
                            else {
                                var Store = dbConnection.createObjectStore(item.Name, {
                                    autoIncrement: true
                                });
                                item.Columns.forEach(function (column) {
                                    if (column.Unique) {
                                        Store.createIndex(column.Name, column.Name, { unique: true });
                                    }
                                    else {
                                        Store.createIndex(column.Name, column.Name, { unique: false });
                                    }
                                });
                            }
                            //setting the table version
                            localStorage.setItem("JsStorage_" + Business.ActiveDataBase.Name + "_" + item.Name, item.Version.toString());
                        }
                        catch (e) {
                            console.error(e);
                        }
                    };
                }
                return CreateDbLogic;
            }());
            Business.CreateDbLogic = CreateDbLogic;
        })(Business = IndexDb.Business || (IndexDb.Business = {}));
    })(IndexDb = JsStore.IndexDb || (JsStore.IndexDb = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var IndexDb;
    (function (IndexDb) {
        var Business;
        (function (Business) {
            var DeleteLogic = (function () {
                function DeleteLogic(query, onSuccess, onError) {
                    try {
                        var That = this, Transaction = Business.DbConnection.transaction([query.From], "readwrite"), ObjectStore = Transaction.objectStore(query.From), ErrorOccured = false, ErrorCount = 0, RowAffected = 0, onErrorGetRequest = function (e) {
                            ++ErrorCount;
                            if (onError != null && this.ErrorCount == 1) {
                                onError(e.target.error);
                            }
                        };
                        Transaction.oncomplete = function () {
                            if (onSuccess != null) {
                                onSuccess(RowAffected);
                            }
                        };
                        Transaction.onerror = onErrorGetRequest;
                        if (query.Where == undefined) {
                            var CursorOpenRequest = ObjectStore.openCursor();
                            CursorOpenRequest.onsuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor) {
                                    Cursor.delete();
                                    ++RowAffected;
                                    Cursor.continue();
                                }
                            };
                            CursorOpenRequest.onerror = onErrorGetRequest;
                        }
                        else {
                            var Column, ExecutionNo = 0, ConditionLength = Object.keys(query.Where).length;
                            for (Column in query.Where) {
                                if (!ErrorOccured) {
                                    if (ObjectStore.indexNames.contains(Column)) {
                                        var CursorOpenRequest = ObjectStore.index(Column).openCursor(IDBKeyRange.only(query.Where[Column])), ExecutionNo = 0;
                                        CursorOpenRequest.onerror = function (e) {
                                            ErrorOccured = true;
                                            onErrorGetRequest(e);
                                        };
                                        CursorOpenRequest.onsuccess = function (e) {
                                            var Cursor = e.target.result;
                                            if (Cursor) {
                                                Cursor.delete();
                                                ++RowAffected;
                                                Cursor.continue();
                                            }
                                        };
                                    }
                                    else {
                                        JsStore.UtilityLogic.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                    }
                                }
                                else {
                                    return;
                                }
                            }
                        }
                    }
                    catch (ex) {
                        if (ex.name == "NotFoundError") {
                            JsStore.UtilityLogic.getError(JsStore.ErrorType.TableNotExist, true, { TableName: query.From });
                        }
                        else {
                            console.warn(ex);
                        }
                    }
                }
                return DeleteLogic;
            }());
            Business.DeleteLogic = DeleteLogic;
        })(Business = IndexDb.Business || (IndexDb.Business = {}));
    })(IndexDb = JsStore.IndexDb || (JsStore.IndexDb = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var IndexDb;
    (function (IndexDb) {
        var Business;
        (function (Business) {
            var DropDbLogic = (function () {
                function DropDbLogic(name, onSuccess, onError) {
                    var DbDropRequest = window.indexedDB.deleteDatabase(name);
                    DbDropRequest.onblocked = function () {
                        if (onError != null) {
                            onError("delete database is in progress");
                        }
                        ;
                    };
                    DbDropRequest.onerror = function (e) {
                        if (onError != null) {
                            onError(event.target.error);
                        }
                    };
                    DbDropRequest.onsuccess = function () {
                        Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                        if (onSuccess != null) {
                            onSuccess();
                        }
                    };
                }
                return DropDbLogic;
            }());
            Business.DropDbLogic = DropDbLogic;
        })(Business = IndexDb.Business || (IndexDb.Business = {}));
    })(IndexDb = JsStore.IndexDb || (JsStore.IndexDb = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var IndexDb;
    (function (IndexDb) {
        var Business;
        (function (Business) {
            var InsertLogic = (function () {
                function InsertLogic(tableName, values, isReturn, onSuccess, onError) {
                    this.RowsAffected = 0;
                    this.ValuesAffected = [];
                    this.ErrorOccured = false;
                    this.ErrorCount = 0;
                    this.onErrorRequest = function (e, customError) {
                        if (customError === void 0) { customError = false; }
                        if (this.ErrorCount == 1) {
                            if (this.OnError != null) {
                                if (!customError) {
                                    this.OnError(e.target.error, this.TotalRowsAffected);
                                }
                                else {
                                    this.OnError(e, this.TotalRowsAffected);
                                }
                            }
                        }
                    };
                    try {
                        this.OnSuccess = onSuccess;
                        this.OnError = onError;
                        var That = this, Transaction = Business.DbConnection.transaction([tableName], "readwrite");
                        Transaction.oncomplete = function (e) {
                            if (onSuccess != null) {
                                onSuccess(isReturn ? That.ValuesAffected : That.RowsAffected);
                            }
                        },
                            Transaction.ontimeout = function () {
                                console.log('transaction timed out');
                            };
                        this.Store = Transaction.objectStore(tableName);
                        values.forEach(function (value) {
                            That.checkSchemaAndModifyValue(value, tableName);
                            if (!That.ErrorOccured) {
                                var AddResult = That.Store.add(value);
                                AddResult.onerror = function (e) {
                                    That.onErrorRequest(e);
                                };
                                AddResult.onsuccess = function (e) {
                                    if (isReturn) {
                                        That.ValuesAffected.push(value);
                                    }
                                    else {
                                        ++That.RowsAffected;
                                    }
                                };
                            }
                            else {
                                That.onErrorRequest(That.Error, true);
                            }
                        });
                    }
                    catch (ex) {
                        console.error(ex);
                    }
                }
                /**
                 * check the defined schema and based upon that modify or create the value
                 *
                 * @private
                 * @param {any} value
                 * @param {string} tableName
                 *
                 * @memberof InsertLogic
                 */
                InsertLogic.prototype.checkSchemaAndModifyValue = function (value, tableName) {
                    var CurrentTable, That = this;
                    Business.ActiveDataBase.Tables.every(function (table) {
                        if (table.Name == tableName) {
                            CurrentTable = table;
                            return false;
                        }
                        return true;
                    });
                    CurrentTable.Columns.forEach(function (column) {
                        if (!That.ErrorOccured) {
                            //check auto increment scheme
                            if (column.AutoIncrement) {
                                var ColumnValue = Number(localStorage.getItem(tableName + "_" + column.Name + "value:"));
                                value[column.Name] = ++ColumnValue;
                                localStorage.setItem(tableName + "_" + column.Name + "value:", ColumnValue.toString());
                            }
                            else if (column.CurrentDate) {
                                value[column.Name] = new Date();
                            }
                            //check not null schema
                            if (column.NotNull && value[column.Name] == null) {
                                That.ErrorOccured = true;
                                ++That.ErrorCount;
                                That.Error = JsStore.UtilityLogic.getError(JsStore.ErrorType.NullValue, false, { ColumnName: column.Name });
                            }
                            //check datatype
                            if (column.DataType && typeof value[column.Name] != column.DataType) {
                                That.ErrorOccured = true;
                                ++That.ErrorCount;
                                That.Error = JsStore.UtilityLogic.getError(JsStore.ErrorType.BadDataType, false, { ColumnName: column.Name });
                            }
                        }
                    });
                };
                return InsertLogic;
            }());
            Business.InsertLogic = InsertLogic;
        })(Business = IndexDb.Business || (IndexDb.Business = {}));
    })(IndexDb = JsStore.IndexDb || (JsStore.IndexDb = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var IndexDb;
    (function (IndexDb) {
        var Business;
        (function (Business) {
            var OpenDbLogic = (function () {
                function OpenDbLogic(objMain, onSuccess, onError) {
                    if (Business.Status.ConStatus != JsStore.ConnectionStatus.Connected) {
                        if (Business.ActiveDataBase.Name.length > 0) {
                            var DbVersion = Number(localStorage.getItem(Business.ActiveDataBase.Name + 'Db_Version')), DbRequest = window.indexedDB.open(Business.ActiveDataBase.Name, DbVersion), That = this;
                            DbRequest.onerror = function (event) {
                                if (onError != null) {
                                    onError(event.target.error);
                                }
                            };
                            DbRequest.onsuccess = function (event) {
                                Business.Status.ConStatus = JsStore.ConnectionStatus.Connected;
                                Business.DbConnection = DbRequest.result;
                                Business.DbConnection.onclose = function () {
                                    Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                                    Business.Status.LastError = "Connection Closed, trying to reconnect";
                                };
                                Business.DbConnection.onversionchange = function (e) {
                                    if (e.newVersion === null) {
                                        e.target.close(); // Manually close our connection to the db
                                    }
                                };
                                Business.DbConnection.onerror = function (e) {
                                    Business.Status.LastError = "Error occured in connection :" + e.target.result;
                                };
                                Business.DbConnection.onabort = function (e) {
                                    Business.Status.ConStatus = JsStore.ConnectionStatus.Closed;
                                    Business.Status.LastError = "Connection Aborted";
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
                }
                return OpenDbLogic;
            }());
            Business.OpenDbLogic = OpenDbLogic;
        })(Business = IndexDb.Business || (IndexDb.Business = {}));
    })(IndexDb = JsStore.IndexDb || (JsStore.IndexDb = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var IndexDb;
    (function (IndexDb) {
        var Business;
        (function (Business) {
            var BaseSelectLogic = (function (_super) {
                __extends(BaseSelectLogic, _super);
                function BaseSelectLogic() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.Results = [];
                    _this.ErrorOccured = false;
                    _this.ErrorCount = 0;
                    _this.SendResultFlag = true;
                    _this.onErrorRequest = function (e) {
                        ++this.ErrorCount;
                        if (this.ErrorCount == 1) {
                            if (this.OnError != null) {
                                this.OnError(e.target.error);
                            }
                        }
                    };
                    _this.getKeyRange = function (whereIn) {
                        var KeyRange;
                        switch (this.Query.WhereIn.Op) {
                            case '-':
                                KeyRange = IDBKeyRange.bound(whereIn.Start, whereIn.End);
                                break;
                            case '>':
                                KeyRange = IDBKeyRange.lowerBound(whereIn.Value, true);
                                break;
                            case '>=':
                                KeyRange = IDBKeyRange.lowerBound(whereIn.Value);
                                break;
                            case '<':
                                KeyRange = IDBKeyRange.upperBound(whereIn.Value, true);
                                break;
                            case '<=':
                                KeyRange = IDBKeyRange.upperBound(whereIn.Value);
                                break;
                            default:
                                this.ErrorOccured = true;
                                JsStore.UtilityLogic.getError(JsStore.ErrorType.InvalidOp, true, { Op: whereIn.Op });
                        }
                        return KeyRange;
                    };
                    _this.executeMultipleWhereInLogic = function (whereInArray) {
                        var That = this, WhereIn, ExecutionNo = 0, ConditionLength = Object.keys(this.Query.WhereIn).length, KeyRange, OnSuccessGetRequest = function () {
                            ++ExecutionNo;
                            if (ExecutionNo == ConditionLength) {
                                this.OnSuceessRequest();
                            }
                        };
                        for (WhereIn in whereInArray) {
                            KeyRange = this.getKeyRange();
                            if (!this.ErrorOccured) {
                                var CursorOpenRequest, OnCursorSuccess = function (e) {
                                    var Cursor = e.target.result;
                                    if (Cursor) {
                                        That.Results.push(Cursor.value);
                                        Cursor.continue();
                                    }
                                    else {
                                        OnSuccessGetRequest();
                                    }
                                }, OnCursorError = function (e) {
                                    That.ErrorOccured = true;
                                    That.OnErrorRequest(e);
                                };
                                if (this.Query.WhereIn.Op == '-') {
                                    CursorOpenRequest = this.ObjectStore.openCursor(KeyRange);
                                    CursorOpenRequest.onsuccess = OnCursorSuccess;
                                    CursorOpenRequest.onerror = OnCursorError;
                                }
                                else if (this.ObjectStore.indexNames.contains(WhereIn.Column)) {
                                    CursorOpenRequest = this.ObjectStore.index(WhereIn.Column).openCursor(KeyRange);
                                    CursorOpenRequest.onsuccess = OnCursorSuccess;
                                    CursorOpenRequest.onerror = OnCursorError;
                                }
                                else {
                                    JsStore.UtilityLogic.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                }
                            }
                            else {
                                return;
                            }
                        }
                    };
                    _this.executeSingleWhereInLogic = function (whereIn) {
                        var That = this, KeyRange = this.getKeyRange(whereIn);
                        if (!this.ErrorOccured) {
                            var CursorOpenRequest, OnCursorSuccess = function (e) {
                                var Cursor = e.target.result;
                                if (Cursor) {
                                    That.Results.push(Cursor.value);
                                    Cursor.continue();
                                }
                            }, OnCursorError = function (e) {
                                this.ErrorOccured = true;
                                this.OnErrorRequest(e);
                            };
                            if (whereIn.Op == '-') {
                                CursorOpenRequest = this.ObjectStore.openCursor(KeyRange);
                                CursorOpenRequest.onsuccess = OnCursorSuccess;
                                CursorOpenRequest.onerror = OnCursorError;
                            }
                            else if (this.ObjectStore.indexNames.contains(whereIn.Column)) {
                                CursorOpenRequest = this.ObjectStore.index(whereIn.Column).openCursor(KeyRange);
                                CursorOpenRequest.onsuccess = OnCursorSuccess;
                                CursorOpenRequest.onerror = OnCursorError;
                            }
                            else {
                                JsStore.UtilityLogic.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: whereIn.Column });
                            }
                        }
                    };
                    return _this;
                }
                /**
                 * For matching the different column value existance
                 *
                 * @private
                 * @param {any} where
                 * @param {any} value
                 * @returns
                 *
                 * @memberOf SelectLogic
                 */
                BaseSelectLogic.prototype.checkForWhereConditionMatch = function (where, value) {
                    var TempColumn;
                    for (TempColumn in where) {
                        if (Array.isArray(where[TempColumn])) {
                            var i, Status = true;
                            for (i = 0; i < TempColumn.length; i++) {
                                if (where[TempColumn][i] == value[TempColumn]) {
                                    Status = true;
                                    break;
                                }
                                else {
                                    Status = false;
                                }
                            }
                            ;
                            if (!Status) {
                                return Status;
                            }
                        }
                        else {
                            if (where[TempColumn] != value[TempColumn]) {
                                return false;
                            }
                        }
                    }
                    return true;
                };
                return BaseSelectLogic;
            }(JsStore.DbHelperLogic));
            Business.BaseSelectLogic = BaseSelectLogic;
        })(Business = IndexDb.Business || (IndexDb.Business = {}));
    })(IndexDb = JsStore.IndexDb || (JsStore.IndexDb = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var IndexDb;
    (function (IndexDb) {
        var Business;
        (function (Business) {
            var SelectJoinLogic = (function (_super) {
                __extends(SelectJoinLogic, _super);
                function SelectJoinLogic(query, onSuccess, onError) {
                    var _this = _super.call(this) || this;
                    _this.QueryStack = [];
                    _this.CurrentQueryStackIndex = 0;
                    _this.onTransactionCompleted = function (e) {
                        if (this.OnSuccess != null && (this.QueryStack.length == this.CurrentQueryStackIndex + 1)) {
                            this.OnSuccess(this.Results);
                        }
                    };
                    _this.executeWhereJoinLogic = function (joinQuery, query) {
                        var That = this, Results = [], JoinIndex, TmpResults = That.Results;
                        //get the data from query table
                        new Business.SelectLogic({
                            From: query.Table,
                            Where: query.Where,
                            WhereIn: query.WhereIn
                        }, function (results) {
                            //perform join
                            JoinIndex = 0;
                            var Item, ResultLength = TmpResults.length;
                            results.forEach(function (value, index) {
                                //search item through each global result
                                for (var i = 0; i < ResultLength; i++) {
                                    Item = TmpResults[i][joinQuery.Table][joinQuery.Column];
                                    if (Item == value[query.Column]) {
                                        doJoin(value, i);
                                        ++JoinIndex;
                                    }
                                }
                            });
                            That.Results = Results;
                            if (That.QueryStack.length > That.CurrentQueryStackIndex + 1) {
                                That.startExecutionJoinLogic();
                            }
                            else {
                                That.onTransactionCompleted(null);
                            }
                        }, function (error) {
                            this.onErrorRequest(error);
                        });
                        var doJoin = function (value, itemIndex) {
                            // if (Results[JoinIndex] == undefined) {
                            Results[JoinIndex] = {};
                            // }
                            switch (query.JoinType) {
                                //inner join
                                case 'inner':
                                    Results[JoinIndex][query.Table] = value;
                                    //copy other relative data into current result
                                    for (var j = 0; j < That.CurrentQueryStackIndex; j++) {
                                        Results[JoinIndex][That.QueryStack[j].Table] = TmpResults[itemIndex][That.QueryStack[j].Table];
                                    }
                                    break;
                                //left join
                                case 'left':
                                    if (value != null) {
                                        That.Results[JoinIndex][query.Table] = value;
                                    }
                                    else {
                                        That.Results[JoinIndex][query.Table] = null;
                                    }
                                    ;
                                    break;
                                //right join
                                case 'right':
                                    if (value[query.Column] == That.Results[JoinIndex][joinQuery.Table][joinQuery.Column]) {
                                        That.Results[JoinIndex][query.Table] = value;
                                    }
                                    else {
                                        That.Results.splice(JoinIndex, 0, null);
                                        That.Results[JoinIndex][joinQuery.Table] = null;
                                        That.Results[JoinIndex][query.Table] = value;
                                    }
                                    break;
                            }
                        };
                    };
                    _this.executeWhereUndefinedLogicForJoin = function (joinQuery, query) {
                        try {
                            var That = this, Results = [], JoinIndex, TmpResults = That.Results, CursorOpenRequest, ResultLength = this.Results.length, Transaction = Business.DbConnection.transaction([query.Table], "readonly");
                            Transaction.oncomplete = function (e) {
                                That.onTransactionCompleted(e);
                                if (That.QueryStack.length > That.CurrentQueryStackIndex + 1) {
                                    That.startExecutionJoinLogic();
                                }
                            };
                            var ExecuteLogic = function (item, index) {
                                JoinIndex = 0;
                                this.ObjectStore = Transaction.objectStore(query.Table);
                                CursorOpenRequest = this.ObjectStore.index(query.Column).openCursor(IDBKeyRange.only(item[joinQuery.Column]));
                                CursorOpenRequest.onsuccess = function (e) {
                                    var Cursor = e.target.result;
                                    if (Cursor) {
                                        doJoin(Cursor.value);
                                        Cursor.continue();
                                        ++JoinIndex;
                                    }
                                    else {
                                        //copy other relative data into current result
                                        if (That.CurrentQueryStackIndex == 1) {
                                            That.Results = Results;
                                        }
                                        else {
                                            for (var i = 0; i < Results.length; i++) {
                                                var ColumnValue = Results[i][joinQuery.Table][joinQuery.Column], TableName;
                                                for (var j = 0; j < TmpResults.length; j++) {
                                                    if (ColumnValue == TmpResults[j][joinQuery.Table][joinQuery.Column]) {
                                                        for (var k = 0; k < That.CurrentQueryStackIndex; k++) {
                                                            // Results[JoinIndex][joinQuery.Table] = item;
                                                            TableName = That.QueryStack[k].Table;
                                                            Results[i][TableName] = TmpResults[j][TableName];
                                                        }
                                                        break;
                                                    }
                                                }
                                            }
                                            That.Results = Results;
                                        }
                                        // if (index == ResultLength - 1 && (That.QueryStack.length > That.CurrentQueryStackIndex + 1)) {
                                        //     That.startExecutionJoinLogic();
                                        // }
                                    }
                                };
                                CursorOpenRequest.onerror = That.onErrorRequest;
                                var doJoin = function (value) {
                                    Results[JoinIndex] = {};
                                    switch (query.JoinType) {
                                        //inner join
                                        case 'inner':
                                            Results[JoinIndex][query.Table] = value;
                                            Results[JoinIndex][joinQuery.Table] = item;
                                            break;
                                        //left join
                                        case 'left':
                                            if (value != null) {
                                                That.Results[index][query.Table] = value;
                                            }
                                            else {
                                                That.Results[index][query.Table] = null;
                                            }
                                            ;
                                            break;
                                        //right join
                                        case 'right':
                                            if (value[query.Column] == That.Results[index][joinQuery.Table][joinQuery.Column]) {
                                                That.Results[index][query.Table] = value;
                                            }
                                            else {
                                                That.Results.splice(index, 0, null);
                                                That.Results[index][joinQuery.Table] = null;
                                                That.Results[index][query.Table] = value;
                                            }
                                            break;
                                    }
                                };
                            };
                            for (var i = 0; i < ResultLength; i++) {
                                ExecuteLogic(TmpResults[i][joinQuery.Table], i);
                            }
                        }
                        catch (ex) {
                            if (ex.name == "NotFoundError") {
                                JsStore.UtilityLogic.getError(JsStore.ErrorType.TableNotExist, true, { TableName: query.Table });
                            }
                            else {
                                console.warn(ex);
                            }
                        }
                    };
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    var That = _this, TableList = []; // used to open the multiple object store
                    var convertQueryIntoStack = function (query) {
                        if (query.hasOwnProperty('Table1')) {
                            query.Table2['JoinType'] = query.Join == undefined ? 'inner' : query.Join.toLowerCase();
                            That.QueryStack.push(query.Table2);
                            if (That.QueryStack.length % 2 == 0) {
                                That.QueryStack[That.QueryStack.length - 1].NextJoin = query.NextJoin;
                            }
                            TableList.push(query.Table2.Table);
                            return convertQueryIntoStack(query.Table1);
                        }
                        else {
                            That.QueryStack.push(query);
                            TableList.push(query.Table);
                            return;
                        }
                    };
                    convertQueryIntoStack(query.From);
                    _this.QueryStack.reverse();
                    // if (this.QueryStack.length > 2) {
                    //     for (var i = 0, length = this.QueryStack.length; i < length; i++) {
                    //         if (i % 2 == 1 && this.QueryStack[i].NextJoin != null) {
                    //         }
                    //         else {
                    //             this.ErrorOccured = true;
                    //             UtilityLogic.getError(ErrorType.NextJoinNotExist, true, {});
                    //             break;
                    //         }
                    //     }
                    // }
                    //get the data for first table
                    if (!_this.ErrorOccured) {
                        new Business.SelectLogic({
                            From: _this.QueryStack[0].Table,
                            Where: _this.QueryStack[0].Where,
                            WhereIn: _this.QueryStack[0].WhereIn
                        }, function (results) {
                            var TableName = That.QueryStack[0].Table;
                            results.forEach(function (item, index) {
                                That.Results[index] = {};
                                That.Results[index][TableName] = item;
                            });
                            That.startExecutionJoinLogic();
                        }, function (error) {
                            That.onErrorRequest(error);
                        });
                    }
                    return _this;
                }
                SelectJoinLogic.prototype.startExecutionJoinLogic = function () {
                    var JoinQuery;
                    if (this.CurrentQueryStackIndex >= 1 && this.CurrentQueryStackIndex % 2 == 1) {
                        // if (this.QueryStack[this.CurrentQueryStackIndex].Table == this.QueryStack[this.CurrentQueryStackIndex].NextJoin.Table) {
                        //     this.QueryStack[this.CurrentQueryStackIndex].Column = this.QueryStack[this.CurrentQueryStackIndex].Column;
                        // }
                        // else {
                        //     this.QueryStack[this.CurrentQueryStackIndex].Column = this.QueryStack[this.CurrentQueryStackIndex].Column;
                        // }
                        JoinQuery = {
                            Table: this.QueryStack[this.CurrentQueryStackIndex].NextJoin.Table,
                            Column: this.QueryStack[this.CurrentQueryStackIndex].NextJoin.Column
                        };
                        this.CurrentQueryStackIndex++;
                    }
                    else {
                        JoinQuery = this.QueryStack[this.CurrentQueryStackIndex++];
                    }
                    var Query = this.QueryStack[this.CurrentQueryStackIndex];
                    if (Query.WhereIn || Query.Where) {
                        this.executeWhereJoinLogic(JoinQuery, Query);
                    }
                    else {
                        this.executeWhereUndefinedLogicForJoin(JoinQuery, Query);
                    }
                };
                return SelectJoinLogic;
            }(Business.BaseSelectLogic));
            Business.SelectJoinLogic = SelectJoinLogic;
        })(Business = IndexDb.Business || (IndexDb.Business = {}));
    })(IndexDb = JsStore.IndexDb || (JsStore.IndexDb = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var IndexDb;
    (function (IndexDb) {
        var Business;
        (function (Business) {
            var SelectLogic = (function (_super) {
                __extends(SelectLogic, _super);
                function SelectLogic(query, onSuccess, onError) {
                    var _this = _super.call(this) || this;
                    _this.executeWhereInLogic = function () {
                        if (Array.isArray(this.Query.WhereIn)) {
                            this.executeMultipleWhereInLogic(this.Query.WhereIn);
                        }
                        else {
                            this.executeSingleWhereInLogic(this.Query.WhereIn);
                        }
                    };
                    _this.executeWhereLogic = function () {
                        var Column, SkipRecord = this.Query.Skip, LimitRecord = this.Query.Limit, That = this, ConditionLength = 0, OnSuccessGetRequest = function () {
                            --ConditionLength;
                            // if (ConditionLength == 0)
                            //     That.onSuccessRequest();
                        };
                        var executeInnerWhereLogic = function (column, value) {
                            if (That.ObjectStore.indexNames.contains(column)) {
                                var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                                CursorOpenRequest.onerror = function (e) {
                                    That.ErrorOccured = true;
                                    That.onErrorRequest(e);
                                };
                                if (SkipRecord && LimitRecord) {
                                    var RecordSkipped = false;
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor = e.target.result;
                                        if (Cursor) {
                                            if (RecordSkipped) {
                                                if (That.Results.length != LimitRecord) {
                                                    That.Results.push(Cursor);
                                                    Cursor.continue();
                                                }
                                                else {
                                                    OnSuccessGetRequest();
                                                }
                                            }
                                            else {
                                                RecordSkipped = true;
                                                Cursor.advance(SkipRecord - 1);
                                            }
                                        }
                                        else {
                                            OnSuccessGetRequest();
                                        }
                                    };
                                }
                                else if (SkipRecord) {
                                    var RecordSkipped = false;
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor = e.target.result;
                                        if (Cursor) {
                                            if (RecordSkipped) {
                                                That.Results.push(Cursor);
                                                Cursor.continue();
                                            }
                                            else {
                                                RecordSkipped = true;
                                                Cursor.advance(SkipRecord - 1);
                                            }
                                        }
                                        else {
                                            OnSuccessGetRequest();
                                        }
                                    };
                                }
                                else if (LimitRecord) {
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor = e.target.result;
                                        if (Cursor && That.Results.length != LimitRecord) {
                                            That.Results.push(Cursor.value);
                                            Cursor.continue();
                                        }
                                        else {
                                            OnSuccessGetRequest();
                                        }
                                    };
                                }
                                else {
                                    CursorOpenRequest.onsuccess = function (e) {
                                        var Cursor = e.target.result;
                                        if (Cursor) {
                                            if (That.checkForWhereConditionMatch(That.Query.Where, Cursor.value)) {
                                                That.Results.push(Cursor.value);
                                            }
                                            Cursor.continue();
                                        }
                                        else {
                                            OnSuccessGetRequest();
                                        }
                                    };
                                }
                            }
                            else {
                                JsStore.UtilityLogic.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                return false;
                            }
                        };
                        for (Column in this.Query.Where) {
                            if (Array.isArray(this.Query.Where[Column])) {
                                ConditionLength = this.Query.Where[Column].length;
                                for (var i = 0; i < this.Query.Where[Column].length; i++) {
                                    var ExecutionStatus = executeInnerWhereLogic(Column, this.Query.Where[Column][i]);
                                    if (ExecutionStatus == false) {
                                        break;
                                    }
                                }
                            }
                            else {
                                executeInnerWhereLogic(Column, this.Query.Where[Column]);
                            }
                            break;
                        }
                    };
                    _this.executeWhereUndefinedLogic = function () {
                        var That = this, CursorOpenRequest = this.ObjectStore.openCursor();
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                That.Results.push(Cursor.value);
                                Cursor.continue();
                            }
                        };
                        CursorOpenRequest.onerror = That.onErrorRequest;
                    };
                    var That = _this;
                    _this.Query = query;
                    _this.OnSuccess = onSuccess;
                    _this.OnError = onError;
                    try {
                        _this.Transaction = Business.DbConnection.transaction([query.From], "readonly");
                        _this.Transaction.oncomplete = function (e) {
                            if (That.SendResultFlag && onSuccess != null) {
                                onSuccess(That.Results);
                            }
                        };
                        // (<any>(this.Transaction)).ontimeout = function () {
                        //     console.log('transaction timed out');
                        // }
                        _this.ObjectStore = _this.Transaction.objectStore(query.From);
                        if (query.WhereIn != undefined) {
                            if (query.Where != undefined) {
                                _this.SendResultFlag = false;
                                _this.executeWhereLogic();
                            }
                            _this.SendResultFlag = true;
                            _this.executeWhereInLogic();
                        }
                        else if (query.Where != undefined) {
                            _this.executeWhereLogic();
                        }
                        else {
                            _this.executeWhereUndefinedLogic();
                        }
                    }
                    catch (ex) {
                        if (ex.name == "NotFoundError") {
                            JsStore.UtilityLogic.getError(JsStore.ErrorType.TableNotExist, true, { TableName: query.From });
                        }
                        else {
                            console.warn(ex);
                        }
                    }
                    return _this;
                }
                return SelectLogic;
            }(Business.BaseSelectLogic));
            Business.SelectLogic = SelectLogic;
        })(Business = IndexDb.Business || (IndexDb.Business = {}));
    })(IndexDb = JsStore.IndexDb || (JsStore.IndexDb = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var IndexDb;
    (function (IndexDb) {
        var Business;
        (function (Business) {
            var UpdateLogic = (function () {
                function UpdateLogic(query, onSuccess, onError) {
                    try {
                        var That = this, ErrorOccured = false, ErrorCount = 0, RowAffected = 0, Transaction = Business.DbConnection.transaction([query.In], "readwrite"), ObjectStore = Transaction.objectStore(query.In), onErrorGetRequest = function (e) {
                            if (ErrorCount == 1) {
                                if (onError != null) {
                                    onError(e.target.error);
                                }
                            }
                        };
                        Transaction.oncomplete = function (e) {
                            if (onSuccess != null) {
                                onSuccess(RowAffected);
                            }
                        },
                            Transaction.ontimeout = function () {
                                console.log('transaction timed out');
                            };
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
                            };
                            CursorOpenRequest.onerror = onErrorGetRequest;
                        }
                        else {
                            for (var TmpColumn in query.Where) {
                                if (!ErrorOccured) {
                                    if (ObjectStore.indexNames.contains(TmpColumn)) {
                                        var CursorOpenRequest = ObjectStore.index(TmpColumn).openCursor(IDBKeyRange.only(query.Where[TmpColumn]));
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
                                        };
                                        CursorOpenRequest.onerror = function (e) {
                                            ErrorOccured = true;
                                            ++ErrorCount;
                                            onErrorGetRequest(e);
                                        };
                                    }
                                    else {
                                        JsStore.UtilityLogic.getError(JsStore.ErrorType.ColumnNotExist, true, { ColumnName: Column });
                                    }
                                }
                                else {
                                    return;
                                }
                            }
                        }
                    }
                    catch (ex) {
                        if (ex.name == "NotFoundError") {
                            JsStore.UtilityLogic.getError(JsStore.ErrorType.TableNotExist, true, { TableName: query.In });
                        }
                        else {
                            console.warn(ex);
                        }
                    }
                }
                return UpdateLogic;
            }());
            Business.UpdateLogic = UpdateLogic;
        })(Business = IndexDb.Business || (IndexDb.Business = {}));
    })(IndexDb = JsStore.IndexDb || (JsStore.IndexDb = {}));
})(JsStore || (JsStore = {}));
var JsStore;
(function (JsStore) {
    var IndexDb;
    (function (IndexDb) {
        var Business;
        (function (Business) {
            var ClearLogic = (function () {
                function ClearLogic(tableName, onSuccess, onError) {
                    var ObjectStore = Business.DbConnection.transaction([tableName], "readwrite").Transaction.objectStore(tableName), ClearRequest = ObjectStore.clear();
                    ClearRequest.onsuccess = function (e) {
                        if (onSuccess != null) {
                            onSuccess();
                        }
                    };
                    ClearRequest.onerror = function (e) {
                        if (onError != null) {
                            onError();
                        }
                    };
                }
                return ClearLogic;
            }());
            Business.ClearLogic = ClearLogic;
        })(Business = IndexDb.Business || (IndexDb.Business = {}));
    })(IndexDb = JsStore.IndexDb || (JsStore.IndexDb = {}));
})(JsStore || (JsStore = {}));
var Table = JsStore.IndexDb.Model.Table;
var Column = JsStore.IndexDb.Model.Column;
var JsStore;
(function (JsStore) {
    var IndexDb;
    (function (IndexDb) {
        var Business;
        (function (Business) {
            Business.Status = {
                ConStatus: JsStore.ConnectionStatus.NotStarted,
                LastError: ""
            };
            var MainLogic = (function () {
                function MainLogic(dataBase) {
                    this.openDb = function (objMain, onSuccess, onError) {
                        var ObjOpenDb = new Business.OpenDbLogic(objMain, onSuccess, onError);
                    };
                    this.closeDb = function () {
                        if (Business.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                            Business.DbConnection.close();
                        }
                    };
                    this.dropDb = function (onSuccess, onError) {
                        var ObjDropDb = new Business.DropDbLogic(Business.ActiveDataBase.Name, onSuccess, onError);
                    };
                    this.update = function (query, onSuccess, onError) {
                        var ObjUpdate = new Business.UpdateLogic(query, onSuccess, onError);
                    };
                    this.insert = function (tableName, values, isReturn, onSuccess, onError) {
                        if (!Array.isArray(values)) {
                            throw "Value should be array :- supplied value is not array";
                        }
                        else if (values.length > 0) {
                            var ObjInsert = new Business.InsertLogic(tableName, values, isReturn, onSuccess, onError);
                        }
                        else {
                            if (onError != null) {
                                onError(JsStore.UtilityLogic.getError(JsStore.ErrorType.NoValueSupplied, true, null));
                            }
                        }
                    };
                    this.delete = function (query, onSuccess, onError) {
                        var ObjDelete = new Business.DeleteLogic(query, onSuccess, onError);
                    };
                    this.select = function (query, onSuccess, onError) {
                        if (typeof query.From === 'object') {
                            new Business.SelectJoinLogic(query, onSuccess, onError);
                        }
                        else {
                            new Business.SelectLogic(query, onSuccess, onError);
                        }
                    };
                    this.createDb = function (objMain, onSuccess, onError) {
                        new Business.CreateDbLogic(objMain, onSuccess, onError);
                    };
                    this.clear = function (tableName, onSuccess, onError) {
                        new Business.ClearLogic(tableName, onSuccess, onError);
                    };
                    Business.ActiveDataBase = dataBase;
                }
                return MainLogic;
            }());
            Business.MainLogic = MainLogic;
        })(Business = IndexDb.Business || (IndexDb.Business = {}));
    })(IndexDb = JsStore.IndexDb || (JsStore.IndexDb = {}));
})(JsStore || (JsStore = {}));
var KeyStoreModel = JsStore.KeyStores.Model;
var KeyStoreBusiness = JsStore.KeyStores.Business;
var JsStore;
(function (JsStore) {
    var KeyStore = (function () {
        function KeyStore() {
            this.TableName = "Local_Storage";
            if (KeyStoreBusiness.Status.ConStatus == JsStore.ConnectionStatus.NotStarted) {
                JsStore.UtilityLogic.setDbType();
                var Table = {
                    Name: this.TableName,
                    Columns: [{
                            Name: "Key",
                            PrimaryKey: true
                        }]
                };
                var keyStore_DataBase = {
                    Name: "JsStore_KeyStore",
                    Tables: [Table]
                };
                var Db = new KeyStoreModel.DataBase(keyStore_DataBase);
                this.KeyStoreObj = new KeyStoreBusiness.MainLogic(Db);
                this.KeyStoreObj.createDb();
            }
        }
        /**
         *
         *
         * @param {Function} onSuccess
         * @param {Function} onError
         *
         * @memberOf Main
         */
        KeyStore.prototype.openDb = function (onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            this.KeyStoreObj.openDb(this, onSuccess, onError);
        };
        /**
         *
         *
         * @param {Function} onSuccess
         * @param {Function} onError
         *
         * @memberOf Main
         */
        KeyStore.prototype.closeDb = function (onSuccess, onError) {
            this.KeyStoreObj.closeDb();
        };
        KeyStore.prototype.get = function (key, onSuccess, onError) {
            if (onError === void 0) { onError = null; }
            if (KeyStoreBusiness.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                var Query = {
                    From: this.TableName,
                    Where: {
                        Key: key
                    }
                };
                this.KeyStoreObj.get(Query, onSuccess, onError);
            }
            else if (KeyStoreBusiness.Status.ConStatus == JsStore.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.get(key, onSuccess, onError);
                }, 50);
            }
            else if (KeyStoreBusiness.Status.ConStatus == JsStore.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.get(key, onSuccess, onError);
                });
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
        KeyStore.prototype.set = function (key, value, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            if (KeyStoreBusiness.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                var IsReturn = false;
                var Value = {
                    Key: key,
                    Value: value
                };
                this.KeyStoreObj.set(this.TableName, Value, IsReturn, onSuccess, onError);
            }
            else if (KeyStoreBusiness.Status.ConStatus == JsStore.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.set(key, value, onSuccess, onError);
                }, 50);
            }
            else if (KeyStoreBusiness.Status.ConStatus == JsStore.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.set(key, value, onSuccess, onError);
                });
            }
        };
        KeyStore.prototype.remove = function (key, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            if (KeyStoreBusiness.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                var Query = {
                    From: this.TableName,
                    Where: {
                        Key: key
                    }
                };
                this.KeyStoreObj.remove(Query, onSuccess, onError);
            }
            else if (KeyStoreBusiness.Status.ConStatus == JsStore.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.remove(key, onSuccess, onError);
                }, 50);
            }
            else if (KeyStoreBusiness.Status.ConStatus == JsStore.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.remove(key, onSuccess, onError);
                });
            }
        };
        return KeyStore;
    }());
    JsStore.KeyStore = KeyStore;
})(JsStore || (JsStore = {}));
var IndexDbModel = JsStore.IndexDb.Model;
var IndexDbBusiness = JsStore.IndexDb.Business;
var JsStore;
(function (JsStore) {
    var Instance = (function () {
        function Instance() {
            JsStore.UtilityLogic.setDbType();
            //IndexDb.KeyStoreObj = new KeyStore();
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
        Instance.prototype.createDb = function (dataBase, onSuccess, onError) {
            var Db = new IndexDbModel.DataBase(dataBase);
            this.IndexDbObj = new IndexDbBusiness.MainLogic(Db);
            var DbVersion = Number(localStorage.getItem(dataBase.Name + 'Db_Version'));
            this.IndexDbObj.createDb(this, onSuccess, onError);
            //Business.IndexDb.Db = Db;
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
        Instance.prototype.openDb = function (onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            this.IndexDbObj.openDb(this, onSuccess, onError);
        };
        /**
         *
         *
         * @param {Function} onSuccess
         * @param {Function} onError
         *
         * @memberOf Main
         */
        Instance.prototype.closeDb = function (onSuccess, onError) {
            this.IndexDbObj.closeDb();
        };
        Instance.prototype.dropDb = function (onSuccess, onError) {
            this.IndexDbObj.dropDb(onSuccess, onError);
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
        Instance.prototype.select = function (query, onSuccess, onError) {
            if (IndexDbBusiness.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                this.IndexDbObj.select(query, onSuccess, onError);
            }
            else if (IndexDbBusiness.Status.ConStatus == JsStore.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.select(query, onSuccess, onError);
                }, 50);
            }
            else if (IndexDbBusiness.Status.ConStatus == JsStore.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.select(query, onSuccess, onError);
                });
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
        Instance.prototype.insert = function (query, onSuccess, onError) {
            if (IndexDbBusiness.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                var IsReturn = query.Return ? query.Return : false;
                this.IndexDbObj.insert(query.Into, query.Values, IsReturn, onSuccess, onError);
            }
            else if (IndexDbBusiness.Status.ConStatus == JsStore.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.insert(query, onSuccess, onError);
                }, 50);
            }
            else if (IndexDbBusiness.Status.ConStatus == JsStore.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.insert(query, onSuccess, onError);
                });
            }
        };
        Instance.prototype.update = function (query, onSuccess, onError) {
            if (IndexDbBusiness.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                this.IndexDbObj.update(query, onSuccess, onError);
            }
            else if (IndexDbBusiness.Status.ConStatus == JsStore.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.update(query, onSuccess, onError);
                }, 50);
            }
            else if (IndexDbBusiness.Status.ConStatus == JsStore.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.update(query, onSuccess, onError);
                });
            }
        };
        Instance.prototype.delete = function (query, onSuccess, onError) {
            if (IndexDbBusiness.Status.ConStatus == JsStore.ConnectionStatus.Connected) {
                this.IndexDbObj.delete(query, onSuccess, onError);
            }
            else if (IndexDbBusiness.Status.ConStatus == JsStore.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.delete(query, onSuccess, onError);
                }, 50);
            }
            else if (IndexDbBusiness.Status.ConStatus == JsStore.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.delete(query, onSuccess, onError);
                });
            }
        };
        return Instance;
    }());
    JsStore.Instance = Instance;
})(JsStore || (JsStore = {}));
// common files
/// <reference path="CommonLogic.ts" />
/// <reference path="UtilityLogic.ts" />
/// <reference path="DbHelperLogic.ts" />
// KeyStores Files
//Model
/// <reference path="KeyStores/Model/Column.ts" />
/// <reference path="KeyStores/Model/Table.ts" />
/// <reference path="KeyStores/Model/DataBase.ts" />
//Business
/// <reference path="KeyStores/Business/CreateDbLogic.ts" />
/// <reference path="KeyStores/Business/RemoveLogic.ts" />
/// <reference path="KeyStores/Business/SetLogic.ts" />
/// <reference path="KeyStores/Business/OpenDbLogic.ts" />
/// <reference path="KeyStores/Business/BaseGetLogic.ts" />
/// <reference path="KeyStores/Business/GetLogic.ts" />
/// <reference path="KeyStores/Business/MainLogic.ts" />
// IndexDb Files
//Model
/// <reference path="IndexDb/Model/Column.ts" />
/// <reference path="IndexDb/Model/Table.ts" />
/// <reference path="IndexDb/Model/DataBase.ts" />
//Business
/// <reference path="IndexDb/Business/CreateDbLogic.ts" />
/// <reference path="IndexDb/Business/DeleteLogic.ts" />
/// <reference path="IndexDb/Business/DropDbLogic.ts" />
/// <reference path="IndexDb/Business/InsertLogic.ts" />
/// <reference path="IndexDb/Business/OpenDbLogic.ts" />
/// <reference path="IndexDb/Business/BaseSelectLogic.ts" />
/// <reference path="IndexDb/Business/SelectJoinLogic.ts" />
/// <reference path="IndexDb/Business/SelectLogic.ts" />
/// <reference path="IndexDb/Business/UpdateLogic.ts" />
/// <reference path="IndexDb/Business/ClearLogic.ts" />
/// <reference path="IndexDb/Business/MainLogic.ts" />
//Instance files
/// <reference path="KeyStoreInstance.ts" />
/// <reference path="JsStoreInstance.ts" />
//# sourceMappingURL=JsStorage.js.map