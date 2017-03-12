var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var DBType;
        (function (DBType) {
            DBType[DBType["IndexedDb"] = 0] = "IndexedDb";
            DBType[DBType["WebSql"] = 1] = "WebSql";
        })(DBType = Business.DBType || (Business.DBType = {}));
        ;
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
var JsStorage;
(function (JsStorage) {
    var Business;
    (function (Business) {
        var MainLogic = (function () {
            /**
             * Creates an instance of MainLogic.
             *
             * @memberOf MainLogic
             */
            function MainLogic() {
                /**
                 *
                 *
                 * @private
                 *
                 * @memberOf MainLogic
                 */
                this.getDbType = function () {
                    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
                    if (indexedDB) {
                        this.DbType = Business.DBType.IndexedDb;
                        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
                        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
                    }
                    else if (window.openDatabase) {
                        this.DbType = Business.DBType.WebSql;
                    }
                };
                this.getDbType();
            }
            return MainLogic;
        }());
        Business.MainLogic = MainLogic;
    })(Business = JsStorage.Business || (JsStorage.Business = {}));
})(JsStorage || (JsStorage = {}));
/// <reference path="Business/CommonLogic.ts" />
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
//# sourceMappingURL=jsStorage.js.map