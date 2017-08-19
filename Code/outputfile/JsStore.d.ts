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
declare module JsStore {
    var isDbExist: (dbName: string, callback: Function) => void;
    var getDbVersion: (dbName: string, callback: Function) => void;
    var setDbVersion: (dbName: string, version: number, callback: Function) => void;
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
    enum Occurence {
        First = "f",
        Last = "l",
        Any = "a",
    }
}
declare module JsStore {
    interface IError {
        Name: string;
        Message: string;
    }
    class Utils {
        static getError(errorType: ErrorType, logError: boolean, errorDetail: any): IError;
        static convertObjectintoLowerCase(obj: any): void;
        static setDbType: () => void;
    }
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
            protected isNull: (value: any) => boolean;
            protected onExceptionOccured: (ex: DOMException, info: any) => void;
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
            private insertData;
            constructor(query: IInsert, onSuccess: Function, onError: Function);
            private checkSchemaAndModifyValue(value, callBack);
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
            createDb: (dataBase: any, onSuccess: Function, onError: Function) => void;
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
                protected executeWhereUndefinedLogic: () => boolean;
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
            class BaseUpdate extends Base {
                SendResultFlag: Boolean;
                CheckFlag: boolean;
            }
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
import Model = JsStore.Model;
import DataBase = Model.DataBase;
import Column = Model.Column;
import Table = Model.Table;
declare module JsStore {
    class Instance extends CodeExecutionHelper {
        constructor(dbName: any);
        createDb(dataBase: Model.IDataBase, onSuccess: Function, onError?: Function): this;
        dropDb(onSuccess: Function, onError?: Function): this;
        select(query: ISelect, onSuccess?: Function, onError?: Function): this;
        count(query: ICount, onSuccess?: Function, onError?: Function): this;
        insert(query: IInsert, onSuccess?: Function, onError?: Function): this;
        update(query: IUpdate, onSuccess?: Function, onError?: Function): this;
        delete(query: IDelete, onSuccess?: Function, onError?: Function): this;
        clear(tableName: string, onSuccess?: Function, onError?: Function): this;
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
    interface IError {
        Name: string;
        Value: string;
    }
    class Utils {
        static setDbType: () => void;
    }
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
    var init: () => void;
    var get: (key: string, onSuccess: Function, onError?: Function) => any;
    var set: (key: any, value: any, onSuccess?: Function, onError?: Function) => any;
    var remove: (key: string, onSuccess?: Function, onError?: Function) => any;
}
