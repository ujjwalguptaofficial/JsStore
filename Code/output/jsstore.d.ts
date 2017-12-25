declare namespace KeyStore {
    interface IError {
        Name: string;
        Value: string;
    }
    class Utils {
        /**
         * determine and set the DataBase Type
         *
         *
         * @memberOf UtilityLogic
         */
        static setDbType: () => void;
    }
}
declare namespace KeyStore {
    interface ISelect {
        From: any;
        Where: any;
    }
    interface IDelete {
        From: string;
        Where: any;
    }
    enum ConnectionStatus {
        Connected = "connected",
        Closed = "closed",
        NotStarted = "not_connected",
    }
    interface KeyStoreStatus {
        ConStatus: ConnectionStatus;
        LastError: string;
    }
    interface IInsert {
        TableName: string;
        Set: {
            Key: string;
            Value;
            any;
        };
    }
    interface IWebWorkerRequest {
        Name: string;
        Query: any;
        OnSuccess: Function;
        OnError: Function;
    }
    interface IWebWorkerResult {
        ErrorOccured: boolean;
        ErrorDetails: any;
        ReturnedValue: any;
    }
    var RequestQueue: Array<IWebWorkerRequest>, TableName: string, IsCodeExecuting: boolean;
}
declare namespace KeyStore {
    var prcoessExecutionOfCode: (request: IWebWorkerRequest) => void;
    var executeCode: () => void;
    var executeCodeDirect: (request: IWebWorkerRequest) => void;
    var processFinishedRequest: (message: IWebWorkerResult) => void;
}
declare namespace KeyStore {
    namespace Business {
        class Base {
            Results: any;
            OnSuccess: Function;
            OnError: Function;
            ErrorOccured: boolean;
            ErrorCount: number;
            Transaction: IDBTransaction;
            ObjectStore: IDBObjectStore;
            protected onErrorOccured: (e: any) => void;
        }
    }
}
declare namespace KeyStore {
    namespace Business {
        class Get extends Base {
            Query: ISelect;
            private get;
            constructor(query: ISelect, onSuccess: Function, onError: Function);
        }
    }
}
declare namespace KeyStore {
    namespace Business {
        class Set extends Base {
            private setData;
            constructor(query: IInsert, onSuccess: Function, onError: Function);
        }
    }
}
declare namespace KeyStore {
    namespace Business {
        class Remove extends Base {
            Query: IDelete;
            RowAffected: number;
            private remove;
            constructor(query: IDelete, onSuccess: Function, onError: Function);
        }
    }
}
declare namespace KeyStore {
    namespace Business {
        class InitDb {
            constructor(dbName: string, tableName: string, onSuccess: Function, onError: Function);
        }
    }
}
declare namespace KeyStore {
    namespace Business {
        var DbConnection: any, Status: KeyStoreStatus;
        class Main {
            OnSuccess: Function;
            constructor(onSuccess?: any);
            checkConnectionAndExecuteLogic: (request: IWebWorkerRequest) => void;
            private returnResult;
            private executeLogic;
            set: (query: IInsert, onSuccess: Function, onError: Function) => void;
            remove: (query: IDelete, onSuccess: Function, onError: Function) => void;
            get: (query: ISelect, onSuccess: Function, onError: Function) => void;
            createDb: (tableName: any, onSuccess: Function, onError: Function) => void;
        }
    }
}
declare namespace KeyStore {
    /**
     * Initialize KeyStore
     *
     */
    var init: () => void;
    /**
    * return the value by key
    *
    * @param {string} key
    * @param {Function} onSuccess
    * @param {Function} [onError=null]
    */
    var get: (key: string, onSuccess: Function, onError?: Function) => any;
    /**
    * insert or update value
    *
    * @param {any} key
    * @param {any} value
    * @param {Function} [onSuccess=null]
    * @param {Function} [onError=null]
    */
    var set: (key: any, value: any, onSuccess?: Function, onError?: Function) => any;
    /**
    * delete value
    *
    * @param {string} key
    * @param {Function} [onSuccess=null]
    * @param {Function} [onError=null]
    */
    var remove: (key: string, onSuccess?: Function, onError?: Function) => any;
}
declare namespace JsStore {
    enum ErrorType {
        UndefinedColumn = "undefined_column",
        UndefinedValue = "undefined_value",
        UndefinedColumnName = "undefined_column_name",
        UndefinedColumnValue = "undefined_column_value",
        NotArray = "not_array",
        NoValueSupplied = "no_value_supplied",
        ColumnNotExist = "column_not_exist",
        InvalidOp = "invalid_operator",
        NullValue = "null_value",
        BadDataType = "bad_data_type",
        NextJoinNotExist = "next_join_not_exist",
        TableNotExist = "table_not_exist",
        DbNotExist = "db_not_exist",
        IndexedDbUndefined = "indexeddb_undefined",
        IndexedDbBlocked = "indexeddb_blocked",
    }
    enum Occurence {
        First = "f",
        Last = "l",
        Any = "a",
    }
    enum WebWorkerStatus {
        Registered = "registerd",
        Failed = "failed",
        NotStarted = "not_started",
    }
    enum ConnectionStatus {
        Connected = "connected",
        Closed = "closed",
        NotStarted = "not_started",
        UnableToStart = "unable_to_start",
    }
    enum WhereQryOption {
        In = "In",
        Like = "Like",
        Or = "Or",
    }
    enum DataType {
        String = "string",
        Object = "object",
        Array = "array",
    }
}
declare namespace JsStore {
    interface IDbInfo {
        DbName: string;
        Table: {
            Name: string;
            Version: number;
        };
    }
    interface IDataBaseOption {
        Name: string;
        Tables: ITableOption[];
    }
    interface ITableOption {
        Name: string;
        Columns: IColumnOption[];
        Version: number;
    }
    interface IColumnOption {
        Name: string;
        AutoIncrement: boolean;
        PrimaryKey: boolean;
        Unique: boolean;
        NotNull: boolean;
        DataType: string;
        Default: any;
        MultiEntry: boolean;
    }
    interface ISelect {
        From: any;
        Where: any;
        Skip: number;
        Limit: number;
        OnSuccess: (results: any[]) => void;
        OnError: (error: IError) => void;
        Order: IOrder;
        GroupBy: any;
        Aggregate: {
            Max: any;
            Min: any;
            Count: any;
            Sum: any;
            Avg: any;
        };
        IgnoreCase: boolean;
        Distinct: boolean;
    }
    interface IOrder {
        By: string;
        Type: string;
    }
    interface ICount {
        From: any;
        IgnoreCase: boolean;
        Where: any;
        OnSuccess: (noOfRecord: number) => void;
        OnError: (error: IError) => void;
    }
    interface IDelete {
        From: string;
        IgnoreCase: boolean;
        Where: any;
        OnSuccess: (rowsDeleted: number) => void;
        OnError: (error: IError) => void;
    }
    interface IUpdate {
        In: string;
        IgnoreCase: boolean;
        Set: any;
        Where: any;
        OnSuccess: (rowsUpdated: number) => void;
        OnError: (error: IError) => void;
    }
    interface IInsert {
        Into: string;
        Values: any[];
        Return: boolean;
        OnSuccess: (rowsInserted: number) => void;
        OnError: (error: IError) => void;
        SkipDataCheck: boolean;
    }
    interface ICondition {
        Column: string;
        Value: string;
        Op: string;
    }
    interface ITableJoin {
        Column: string;
        Table: string;
        Where: any;
        Order: IOrder;
        JoinType: string;
        NextJoin: INextJoin;
    }
    interface ISelectJoin {
        From: IJoin;
        Count: boolean;
        Skip: number;
        Limit: number;
        OnSuccess: (results) => void;
        OnError: (err: IError) => void;
    }
    interface IJoin {
        Table1: ITableJoin;
        Join: string;
        Table2: ITableJoin;
    }
    interface INextJoin {
        Table: string;
        Column: string;
    }
    interface IJsStoreStatus {
        ConStatus: ConnectionStatus;
        LastError: string;
    }
    interface IWebWorkerRequest {
        Name: string;
        Query: any;
        OnSuccess: (results) => void;
        OnError: (err: IError) => void;
    }
    interface IWebWorkerResult {
        ErrorOccured: boolean;
        ErrorDetails: any;
        ReturnedValue: any;
    }
    interface IError {
        Name: string;
        Message: string;
    }
    interface IAggregate {
        Max: any[];
        Min: any[];
        Sum: any[];
        Count: any[];
        Avg: any[];
    }
}
declare namespace JsStore {
    var enable_log: boolean, db_version: number, status: IJsStoreStatus, temp_results: any[];
    var throwError: (error: any) => never;
    var getObjectFirstKey: (value: any) => string;
    var log: (msg: any) => void;
    var logError: (msg: any) => void;
}
declare namespace JsStore {
    class Utils {
        static getError(errorType: ErrorType, errorDetail: any): IError;
        static convertObjectintoLowerCase(obj: any): void;
        /**
         * determine and set the DataBase Type
         *
         *
         * @memberOf MainLogic
         */
        static setDbType: () => void;
    }
}
declare namespace JsStore {
    /**
     * checks whether db exist or not
     *
     * @param {DbInfo} dbInfo
     * @param {() => void} [callback=null]
     * @param {() => void} [errCallBack=null]
     * @returns
     */
    var isDbExist: (dbInfo: IDbInfo, callback?: (isExist: boolean) => void, errCallBack?: (err: IError) => void) => any;
    /**
     * get Db Version
     *
     * @param {string} dbName
     * @param {(version: number) => void} callback
     */
    var getDbVersion: (dbName: string, callback: (version: number) => void) => void;
    /**
     * get Database Schema
     *
     * @param {string} dbName
     * @param {(any) => void} callback
     */
    var getDbSchema: (dbName: string, callback: (any: any) => void) => void;
    /**
     * check for null value
     *
     * @param {any} value
     * @returns
     */
    var isNull: (value: any) => boolean;
    /**
     * Enable log
     *
     */
    var enableLog: () => void;
    /**
     * disable log
     *
     */
    var disableLog: () => void;
}
declare namespace JsStore {
    namespace Model {
        class Column {
            _name: string;
            _autoIncrement: boolean;
            _primaryKey: boolean;
            _unique: boolean;
            _notNull: boolean;
            _dataType: string;
            _default: any;
            _multiEntry: boolean;
            constructor(key: IColumnOption, tableName: string);
        }
    }
}
declare namespace JsStore {
    namespace Model {
        class Table {
            _name: string;
            _columns: Column[];
            _version: number;
            _requireDelete: boolean;
            _requireCreation: boolean;
            _primaryKey: string;
            constructor(table: ITableOption, dbName: string);
            private setPrimaryKey(dbName);
            private setRequireDelete(dbName);
            private setDbVersion(dbName);
        }
    }
}
declare namespace JsStore {
    namespace Model {
        class DataBase {
            _name: string;
            _tables: Table[];
            constructor(dataBase: IDataBaseOption);
        }
    }
}
declare namespace JsStore {
    namespace Business {
        class BaseHelper {
            protected getTable: (tableName: string) => Table;
            protected getKeyRange: (value: any, op: any) => IDBKeyRange;
            protected getObjectSecondKey: (value: any) => string;
            protected getPrimaryKey: (tableName: any) => any;
            protected getKeyPath: (tableName: any) => string | string[];
            protected sortNumberInAsc: (values: any) => any;
            protected sortNumberInDesc: (values: any) => any;
            protected sortAlphabetInAsc: (values: any) => any;
            protected sortAlphabetInDesc: (values: any) => any;
            protected getAllCombinationOfWord(word: any, isArray: any): any[];
            private getCombination(word);
        }
    }
}
declare namespace JsStore {
    namespace Business {
        class Base extends BaseHelper {
            _error: IError;
            _errorOccured: boolean;
            _errorCount: number;
            _rowAffected: number;
            _onSuccess: (result?) => void;
            _onError: (err: IError) => void;
            _transaction: IDBTransaction;
            _objectStore: IDBObjectStore;
            _query: any;
            _sendResultFlag: boolean;
            _checkFlag: boolean;
            protected onErrorOccured: (e: any, customError?: boolean) => void;
            protected onTransactionTimeout: (e: any) => void;
            protected onExceptionOccured: (ex: DOMException, info: any) => void;
            /**
             * For matching the different column value existance
             *
             * @protected
             * @param {any} rowValue
             * @returns
             * @memberof Base
             */
            protected checkForWhereConditionMatch(rowValue: any): boolean;
            protected goToWhereLogic: () => void;
            protected makeQryInCaseSensitive: (qry: any) => any;
        }
    }
}
declare namespace JsStore {
    namespace Business {
        class CreateDb {
            constructor(dbVersion: any, onSuccess: (listOf) => void, onError: (err: IError) => void);
        }
    }
}
declare namespace JsStore {
    namespace Business {
        class DropDb {
            constructor(name: string, onSuccess: Function, onError: Function);
            deleteDb: (name: string, onSuccess: Function, onError: Function) => void;
        }
    }
}
declare namespace JsStore {
    namespace Business {
        class InsertHelper extends Base {
            _valuesAffected: any[];
            _query: IInsert;
            onTransactionCompleted: () => void;
            protected checkModifyInsertValues: (table: Table, values: any) => void;
        }
    }
}
declare namespace JsStore {
    namespace Business {
        class Insert extends InsertHelper {
            constructor(query: IInsert, onSuccess: (rowsInserted: number) => void, onError: (err: IError) => void);
            private insertData;
        }
    }
}
declare namespace JsStore {
    namespace Business {
        class BulkInsert extends Base {
            ValuesAffected: any[];
            _query: IInsert;
            ValuesIndex: number;
            Table: Model.Table;
            constructor(query: IInsert, onSuccess: () => void, onError: (err: IError) => void);
            onTransactionCompleted: () => void;
            private bulkinsertData;
        }
    }
}
declare namespace JsStore {
    namespace Business {
        class OpenDb {
            constructor(dbVersion: any, onSuccess: () => void, onError: (err: IError) => void);
        }
    }
}
declare namespace JsStore {
    namespace Business {
        class Clear extends Base {
            constructor(tableName: string, onSuccess: () => void, onError: (err: IError) => void);
        }
    }
}
declare namespace JsStore {
    namespace Business {
        var db_connection: any, active_db: DataBase;
        class Main {
            _onSuccess: () => void;
            constructor(onSuccess?: any);
            checkConnectionAndExecuteLogic: (request: IWebWorkerRequest) => void;
            private changeLogStatus;
            private returnResult;
            private executeLogic;
            private openDb;
            private closeDb;
            private dropDb;
            private update;
            private insert;
            private bulkInsert;
            private delete;
            private select;
            private count;
            private createDb;
            private clear;
            private exportJson;
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Select {
            class BaseSelect extends Base {
                _results: any[];
                _sorted: boolean;
                _skipRecord: any;
                _limitRecord: any;
                _checkFlag: boolean;
                protected removeDuplicates: () => void;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Select {
            class NotWhere extends BaseSelect {
                protected executeWhereUndefinedLogic: () => void;
                private executeSkipAndLimitForNoWhere;
                private executeSkipForNoWhere;
                private executeSimpleForNotWhere;
                private executeLimitForNotWhere;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Select {
            class In extends NotWhere {
                protected executeInLogic: (column: any, values: any) => void;
                private executeSkipAndLimitForIn;
                private executeSkipForIn;
                private executeLimitForIn;
                private executeSimpleForIn;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Select {
            class Like extends In {
                _compSymbol: Occurence;
                _compValue: any;
                _column: any;
                _compValueLength: Number;
                protected executeLikeLogic: (column: any, value: any, symbol: Occurence) => void;
                private filterOnOccurence;
                private executeSkipAndLimit;
                private executeSkip;
                private executeLimit;
                private executeSimple;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Select {
            class Where extends Like {
                private executeSkipAndLimitForWhere;
                private executeSkipForWhere;
                private executeLimitForWhere;
                private executeSimpleForWhere;
                private executeWhereLogic;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Select {
            class Join extends BaseSelect {
                _query: ISelectJoin;
                _queryStack: ITableJoin[];
                _currentQueryStackIndex: number;
                constructor(query: ISelectJoin, onSuccess: (results: any[]) => void, onError: (err: IError) => void);
                private onTransactionCompleted;
                private executeWhereJoinLogic;
                private executeRightJoin;
                private executeWhereUndefinedLogicForJoin;
                private startExecutionJoinLogic();
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Select {
            class GroupByHelper extends Where {
                constructor();
                private executeAggregateGroupBy;
                protected processGroupBy: () => void;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Select {
            class Helper extends GroupByHelper {
                constructor();
                processOrderBy: () => void;
                private processAggregateQry;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Select {
            class Instance extends Helper {
                constructor(query: ISelect, onSuccess: (results: any[]) => void, onError: (err: IError) => void);
                onTransactionCompleted: () => void;
                private createtransactionForOrLogic;
                private orQuerySuccess;
                private executeOrLogic;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Count {
            class BaseCount extends Base {
                _resultCount: number;
                _skipRecord: any;
                _limitRecord: any;
                _checkFlag: boolean;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Count {
            class NotWhere extends BaseCount {
                protected executeWhereUndefinedLogic: () => void;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Count {
            class In extends NotWhere {
                private executeInLogic;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Count {
            class Like extends In {
                _compSymbol: Occurence;
                _compValue: any;
                _column: any;
                _compValueLength: number;
                protected executeLikeLogic: (column: any, value: any, symbol: Occurence) => void;
                private filterOnOccurence;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Count {
            class Where extends Like {
                private executeWhereLogic;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Count {
            class Instance extends Where {
                constructor(query: ICount, onSuccess: (noOfRecord: number) => void, onError: (error: IError) => void);
                onTransactionCompleted: () => void;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Update {
            var updateValue: (suppliedValue: any, storedValue: any) => any;
        }
        class BaseUpdate extends Base {
            _checkFlag: boolean;
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Update {
            class NotWhere extends BaseUpdate {
                protected executeWhereUndefinedLogic: () => void;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Update {
            class In extends NotWhere {
                private executeInLogic;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Update {
            class Like extends In {
                CompSymbol: Occurence;
                CompValue: any;
                Column: any;
                CompValueLength: Number;
                private filterOnOccurence;
                protected executeLikeLogic: (column: any, value: any, symbol: Occurence) => void;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Update {
            class Where extends Like {
                private executeWhereLogic;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Update {
            class Instance extends Where {
                constructor(query: IUpdate, onSuccess: () => void, onError: (err: IError) => void);
                protected onTransactionCompleted: () => void;
                private createtransactionForOrLogic;
                private executeOrLogic;
                private checkSchema(suppliedValue, tableName);
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Delete {
            class BaseDelete extends Base {
                _checkFlag: boolean;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Delete {
            class NotWhere extends BaseDelete {
                protected executeWhereUndefinedLogic: () => void;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Delete {
            class In extends NotWhere {
                private executeInLogic;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Delete {
            class Like extends In {
                CompSymbol: Occurence;
                CompValue: any;
                Column: any;
                CompValueLength: Number;
                private filterOnOccurence;
                protected executeLikeLogic: (column: any, value: any, symbol: Occurence) => void;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Delete {
            class Where extends Like {
                private executeWhereLogic;
            }
        }
    }
}
declare namespace JsStore {
    namespace Business {
        namespace Delete {
            class Instance extends Where {
                constructor(query: IDelete, onSuccess: (recordDeleted: number) => void, onError: (err: IError) => void);
                private onTransactionCompleted;
                private createtransactionForOrLogic;
                private executeOrLogic;
            }
        }
    }
}
declare namespace JsStore {
    var worker_status: WebWorkerStatus, worker_instance: Worker;
    class CodeExecutionHelper {
        private _requestQueue;
        private _isCodeExecuting;
        protected pushApi: (request: IWebWorkerRequest, usePromise: boolean) => any;
        protected createWorker: () => void;
        private prcoessExecutionOfCode;
        private executeCode;
        private executeCodeDirect;
        private executeCodeUsingWorker;
        private processFinishedRequest;
        private onWorkerFailed;
        private getScriptUrl(fileName);
        private onMessageFromWorker;
    }
}
import Model = JsStore.Model;
import DataBase = Model.DataBase;
import Column = Model.Column;
import Table = Model.Table;
declare var Promise: any;
declare namespace JsStore {
    class Instance extends CodeExecutionHelper {
        constructor(dbName?: any);
        /**
         * open database
         *
         * @param {string} dbName
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         * @returns
         * @memberof Instance
         */
        openDb: (dbName: string, onSuccess: () => void, onError: (err: IError) => void) => any;
        /**
         * creates DataBase
         *
         * @param {Model.IDataBase} dataBase
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         * @returns
         * @memberof Instance
         */
        createDb: (dataBase: IDataBaseOption, onSuccess: (dbSchema: any) => void, onError: (err: IError) => void) => any;
        /**
         * drop dataBase
         *
         * @param {Function} onSuccess
         * @param {Function} [onError=null]
         * @memberof Instance
         */
        dropDb: (onSuccess: () => void, onError: (err: IError) => void) => any;
        /**
         * select data from table
         *
         * @param {IQuery} query
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         *
         * @memberOf Main
         */
        select: (query: ISelect, onSuccess: (results: any[]) => void, onError: (err: IError) => void) => any;
        /**
         * get no of result from table
         *
         * @param {ICount} query
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         * @memberof Instance
         */
        count: (query: ICount, onSuccess: (noOfRecord: number) => void, onError: (err: IError) => void) => any;
        /**
         * insert data into table
         *
         * @param {IInsert} query
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         * @memberof Instance
         */
        insert: (query: IInsert, onSuccess: (recordInserted: number) => void, onError: (err: IError) => void) => any;
        /**
         * update data into table
         *
         * @param {IUpdate} query
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         * @memberof Instance
         */
        update: (query: IUpdate, onSuccess: (recordUpdated: number) => void, onError: (err: IError) => void) => any;
        /**
         * delete data from table
         *
         * @param {IDelete} query
         * @param {Function} [onSuccess=null]
         * @param {Function} onError
         * @memberof Instance
         */
        delete: (query: IDelete, onSuccess: (recordDeleted: number) => void, onError: (err: IError) => void) => any;
        /**
         * delete all data from table
         *
         * @param {string} tableName
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         * @memberof Instance
         */
        clear: (tableName: string, onSuccess: () => void, onError: (err: IError) => void) => any;
        /**
         * insert bulk amount of data
         *
         * @param {IInsert} query
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         * @returns
         * @memberof Instance
         */
        bulkInsert: (query: IInsert, onSuccess: () => void, onError: (err: IError) => void) => any;
        /**
         * export the result in json file
         *
         * @param {ISelect} qry
         * @memberof Instance
         */
        exportJson: (query: ISelect) => any;
    }
}
