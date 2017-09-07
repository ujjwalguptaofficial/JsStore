/** JsStore.js - v1.1.4 - 07/09/2017
 * https://github.com/ujjwalguptaofficial/JsStore
 * Copyright (c) 2017 @Ujjwal Gupta; Licensed MIT */
declare module JsStore {
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
    }
    enum Occurence {
        First = "f",
        Last = "l",
        Any = "a",
    }
}
declare module JsStore {
    interface DbInfo {
        DbName: string;
        Table: {
            Name: string;
            Version: number;
        };
    }
    interface ISelect {
        From: any;
        Where: any;
        Skip: number;
        Limit: number;
        OnSuccess: Function;
        OnError: Function;
        Order: IOrder;
    }
    interface IOrder {
        By: string;
        Type: string;
    }
    interface ICount {
        From: any;
        Where: any;
        OnSuccess: Function;
        OnError: Function;
    }
    interface IDelete {
        From: string;
        Where: any;
        OnSuccess: Function;
        OnError: Function;
    }
    interface IUpdate {
        In: string;
        Set: any;
        Where: any;
        OnSuccess: Function;
        OnError: Function;
    }
    interface IInsert {
        Into: string;
        Values: Array<any>;
        Return: boolean;
        OnSuccess: Function;
        OnError: Function;
        SkipExtraCheck: boolean;
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
        OnSuccess: Function;
        OnError: Function;
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
    enum ConnectionStatus {
        Connected = "connected",
        Closed = "closed",
        NotStarted = "not_started",
    }
    interface JsStoreStatus {
        ConStatus: ConnectionStatus;
        LastError: string;
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
}
declare module JsStore {
    var EnableLog: boolean, DbVersion: number;
    var throwError: (error: any) => never;
}
declare module JsStore {
    interface IError {
        Name: string;
        Message: string;
    }
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
declare module JsStore {
    /**
    * checks whether db exist or not
    *
    * @param {string} dbName
    * @param {Function} callback
    */
    var isDbExist: (dbInfo: DbInfo, callback: Function) => void;
    /**
    * get Db Version
    *
    * @param {string} dbName
    * @param {Function} callback
    */
    var getDbVersion: (dbName: string, callback: Function) => void;
    /**
    * get Database Schema
    *
    * @param {string} dbName
    * @param {Function} callback
    */
    var getDbSchema: (dbName: string, callback: Function) => void;
    /**
    * check value null or not
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
declare module JsStore {
    module Model {
        interface IColumn {
            Name: string;
            AutoIncrement: boolean;
            PrimaryKey: boolean;
            Unique: boolean;
            NotNull: boolean;
            DataType: string;
            Default: any;
        }
        class Column implements IColumn {
            Name: string;
            AutoIncrement: boolean;
            PrimaryKey: boolean;
            Unique: boolean;
            NotNull: boolean;
            DataType: string;
            Default: any;
            constructor(key: IColumn, tableName: string);
        }
    }
}
declare module JsStore {
    module Model {
        interface ITable {
            Name: string;
            Columns: Array<IColumn>;
            Version: number;
        }
        class Table implements ITable {
            Name: string;
            Columns: Array<Column>;
            Version: number;
            RequireDelete: boolean;
            RequireCreation: boolean;
            PrimaryKey: string;
            constructor(table: ITable, dbName: string);
            private setPrimaryKey(dbName);
            private setRequireDelete(dbName);
            private setDbVersion(dbName);
        }
    }
}
declare module JsStore {
    module Model {
        interface IDataBase {
            Name: string;
            Tables: Array<ITable>;
        }
        class DataBase implements IDataBase {
            Name: string;
            Tables: Array<Table>;
            constructor(dataBase: IDataBase);
        }
    }
}
declare module JsStore {
    module Business {
        class Base {
            Error: IError;
            ErrorOccured: boolean;
            ErrorCount: number;
            RowAffected: number;
            OnSuccess: Function;
            OnError: Function;
            Transaction: IDBTransaction;
            ObjectStore: IDBObjectStore;
            Query: any;
            protected onErrorOccured: (e: any, customError?: boolean) => void;
            protected onTransactionTimeout: (e: any) => void;
            protected onExceptionOccured: (ex: DOMException, info: any) => void;
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
            protected checkForWhereConditionMatch(rowValue: any): boolean;
            protected getTable: (tableName: string) => Table;
            protected getKeyRange: (value: any, op: any) => IDBKeyRange;
        }
    }
}
declare module JsStore {
    module Business {
        class CreateDb {
            constructor(dbVersion: any, onSuccess: Function, onError: Function);
        }
    }
}
declare module JsStore {
    module Business {
        class DropDb {
            constructor(name: string, onSuccess: Function, onError: Function);
        }
    }
}
declare module JsStore {
    module Business {
        class Insert extends Base {
            ValuesAffected: any[];
            Query: IInsert;
            ValuesIndex: number;
            Table: Model.ITable;
            onTransactionCompleted: () => void;
            private checkAndModifyValues;
            private insertData;
            constructor(query: IInsert, onSuccess: Function, onError: Function);
            /**
             * check the value based on defined schema and modify or create the value
             *
             * @private
             * @param {any} value
             * @param {string} tableName
             *
             * @memberof InsertLogic
             */
            private checkAndModifyValue(value, callBack);
        }
    }
}
declare module JsStore {
    module Business {
        class OpenDb {
            constructor(dbVersion: any, onSuccess: Function, onError: Function);
        }
    }
}
declare module JsStore {
    module Business {
        class Clear extends Base {
            constructor(tableName: string, onSuccess: Function, onError: Function);
        }
    }
}
declare module JsStore {
    module Business {
        var DbConnection: any, ActiveDataBase: DataBase, Status: JsStoreStatus;
        class Main {
            OnSuccess: Function;
            constructor(onSuccess?: any);
            checkConnectionAndExecuteLogic: (request: IWebWorkerRequest) => void;
            private returnResult;
            private executeLogic;
            openDb: (dbName: any, onSuccess: Function, onError: Function) => void;
            closeDb: () => void;
            dropDb: (onSuccess: Function, onError: Function) => void;
            update: (query: IUpdate, onSuccess: Function, onError: Function) => void;
            insert: (query: IInsert, onSuccess: Function, onError: Function) => void;
            delete: (query: IDelete, onSuccess: Function, onError: Function) => void;
            select: (query: any, onSuccess: Function, onError: Function) => void;
            count: (query: any, onSuccess: Function, onError: Function) => void;
            createDb: (dataBase: Model.IDataBase, onSuccess: Function, onError: Function) => void;
            clear: (tableName: string, onSuccess: Function, onError: Function) => void;
        }
    }
}
declare module JsStore {
    module Business {
        module Select {
            class BaseSelect extends Base {
                Results: any[];
                SendResultFlag: Boolean;
                Sorted: boolean;
                SkipRecord: any;
                LimitRecord: any;
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Select {
            class NotWhere extends BaseSelect {
                protected executeWhereUndefinedLogic: () => void;
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Select {
            class Like extends NotWhere {
                CompSymbol: Occurence;
                CompValue: any;
                Column: any;
                CheckFlag: boolean;
                private filterOnOccurence;
                private executeSkipAndLimit;
                private executeSkip;
                private executeLimit;
                private executeSimple;
                protected executeLikeLogic: (column: any, value: any, symbol: Occurence) => void;
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Select {
            class Where extends Like {
                private executeRequest;
                protected executeWhereLogic: () => void;
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Select {
            class Join extends BaseSelect {
                Query: ISelectJoin;
                QueryStack: Array<ITableJoin>;
                CurrentQueryStackIndex: number;
                private onTransactionCompleted;
                private executeWhereJoinLogic;
                private executeRightJoin;
                private executeWhereUndefinedLogicForJoin;
                private startExecutionJoinLogic();
                constructor(query: ISelectJoin, onSuccess: Function, onError: Function);
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Select {
            class Instance extends Where {
                onTransactionCompleted: () => void;
                constructor(query: ISelect, onSuccess: Function, onError: Function);
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Count {
            class BaseCount extends Base {
                ResultCount: number;
                SkipRecord: any;
                LimitRecord: any;
                SendResultFlag: Boolean;
                CheckFlag: boolean;
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Count {
            class NotWhere extends BaseCount {
                protected executeWhereUndefinedLogic: () => void;
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Count {
            class Like extends NotWhere {
                CompSymbol: Occurence;
                CompValue: any;
                Column: any;
                private filterOnOccurence;
                protected executeLikeLogic: (column: any, value: any, symbol: Occurence) => void;
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Count {
            class Where extends Like {
                private executeRequest;
                protected executeWhereLogic: () => void;
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Count {
            class Instance extends Where {
                onTransactionCompleted: () => void;
                constructor(query: ICount, onSuccess: Function, onError: Function);
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Update {
            var updateValue: (suppliedValue: any, storedValue: any) => any;
        }
        class BaseUpdate extends Base {
            SendResultFlag: Boolean;
            CheckFlag: boolean;
        }
    }
}
declare module JsStore {
    module Business {
        module Update {
            class NotWhere extends BaseUpdate {
                protected executeWhereUndefinedLogic: () => void;
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Update {
            class Like extends NotWhere {
                CompSymbol: Occurence;
                CompValue: any;
                Column: any;
                private filterOnOccurence;
                protected executeLikeLogic: (column: any, value: any, symbol: Occurence) => void;
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Update {
            class Where extends Like {
                private executeRequest;
                protected executeWhereLogic: () => void;
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Update {
            class Instance extends Where {
                onTransactionCompleted: () => void;
                constructor(query: IUpdate, onSuccess: Function, onError: Function);
                private checkSchema(suppliedValue, tableName);
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Delete {
            class BaseDelete extends Base {
                SendResultFlag: Boolean;
                CheckFlag: boolean;
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Delete {
            class NotWhere extends BaseDelete {
                protected executeWhereUndefinedLogic: () => void;
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Delete {
            class Like extends NotWhere {
                CompSymbol: Occurence;
                CompValue: any;
                Column: any;
                private filterOnOccurence;
                protected executeLikeLogic: (column: any, value: any, symbol: Occurence) => void;
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Delete {
            class Where extends Like {
                private executeRequest;
                protected executeWhereLogic: () => void;
            }
        }
    }
}
declare module JsStore {
    module Business {
        module Delete {
            class Instance extends Where {
                private onTransactionCompleted;
                constructor(query: IDelete, onSuccess: Function, onError: Function);
            }
        }
    }
}
declare module JsStore {
    enum WebWorkerStatus {
        Registered = "registerd",
        Failed = "failed",
        NotStarted = "not_started",
    }
    var WorkerStatus: WebWorkerStatus, WorkerInstance: Worker;
    class CodeExecutionHelper {
        RequestQueue: Array<IWebWorkerRequest>;
        IsCodeExecuting: boolean;
        protected prcoessExecutionOfCode: (request: IWebWorkerRequest) => void;
        private executeCode;
        private executeCodeDirect;
        private executeCodeUsingWorker;
        private processFinishedRequest;
        private onWorkerFailed;
        protected createWorker: () => void;
        private getScriptUrl(fileName);
        private onMessageFromWorker;
    }
}
import Model = JsStore.Model;
import DataBase = Model.DataBase;
import Column = Model.Column;
import Table = Model.Table;
declare module JsStore {
    class Instance extends CodeExecutionHelper {
        constructor(dbName: any);
        /**
         * creates DataBase
         *
         * @param {IDataBase} dataBase
         * @param {Function} onSuccess
         * @param {Function} [onError=null]
         * @returns
         *
         * @memberOf Main
         */
        createDb(dataBase: Model.IDataBase, onSuccess: Function, onError?: Function): this;
        /**
         * drop dataBase
         *
         * @param {Function} onSuccess
         * @param {Function} [onError=null]
         * @memberof Instance
         */
        dropDb(onSuccess: Function, onError?: Function): this;
        /**
         * select data from table
         *
         * @param {IQuery} query
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         *
         * @memberOf Main
         */
        select(query: ISelect, onSuccess?: Function, onError?: Function): this;
        /**
         * get no of result from table
         *
         * @param {ICount} query
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         * @memberof Instance
         */
        count(query: ICount, onSuccess?: Function, onError?: Function): this;
        /**
         * insert data into table
         *
         * @param {IInsert} query
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         * @memberof Instance
         */
        insert(query: IInsert, onSuccess?: Function, onError?: Function): this;
        /**
         * update data into table
         *
         * @param {IUpdate} query
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         * @memberof Instance
         */
        update(query: IUpdate, onSuccess?: Function, onError?: Function): this;
        /**
         * delete data from table
         *
         * @param {IDelete} query
         * @param {Function} [onSuccess=null]
         * @param {Function} onError
         * @memberof Instance
         */
        delete(query: IDelete, onSuccess?: Function, onError?: Function): this;
        /**
         * delete all data from table
         *
         * @param {string} tableName
         * @param {Function} [onSuccess=null]
         * @param {Function} [onError=null]
         * @memberof Instance
         */
        clear(tableName: string, onSuccess?: Function, onError?: Function): this;
    }
}
declare module KeyStore {
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
declare module KeyStore {
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
declare module KeyStore {
    var prcoessExecutionOfCode: (request: IWebWorkerRequest) => void;
    var executeCode: () => void;
    var executeCodeDirect: (request: IWebWorkerRequest) => void;
    var processFinishedRequest: (message: IWebWorkerResult) => void;
}
declare module KeyStore {
    module Business {
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
declare module KeyStore {
    module Business {
        class Get extends Base {
            Query: ISelect;
            private get;
            constructor(query: ISelect, onSuccess: Function, onError: Function);
        }
    }
}
declare module KeyStore {
    module Business {
        class Set extends Base {
            private setData;
            constructor(query: IInsert, onSuccess: Function, onError: Function);
        }
    }
}
declare module KeyStore {
    module Business {
        class Remove extends Base {
            Query: IDelete;
            RowAffected: number;
            private remove;
            constructor(query: IDelete, onSuccess: Function, onError: Function);
        }
    }
}
declare module KeyStore {
    module Business {
        class InitDb {
            constructor(dbName: string, tableName: string, onSuccess: Function, onError: Function);
        }
    }
}
declare module KeyStore {
    module Business {
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
declare module KeyStore {
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
