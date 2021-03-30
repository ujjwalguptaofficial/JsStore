import { ConnectionHelper } from "./connection_helper";
import { SelectQuery, CountQuery, InsertQuery, UpdateQuery, RemoveQuery, DbInfo, TranscationQuery, IDataBase, EVENT, IPlugin, IntersectQuery } from "../common/index";
export declare class Connection extends ConnectionHelper {
    constructor(worker?: Worker);
    /**
     * open database
     *
     * @param {string} dbName
     * @returns
     * @memberof Connection
     */
    openDb(dbName: string): Promise<null>;
    /**
     * creates DataBase
     *
     * @param {IDataBase} dataBase
     * @returns
     * @memberof Connection
     */
    initDb(dataBase: IDataBase): Promise<boolean>;
    /**
     * drop dataBase
     *
     * @returns
     * @memberof Connection
     */
    dropDb(): Promise<void>;
    /**
     * select data from table
     *
     * @template T
     * @param {SelectQuery} query
     * @returns
     * @memberof Connection
     */
    select<T>(query: SelectQuery): Promise<T[]>;
    /**
     * get no of record from table
     *
     * @param {CountQuery} query
     * @returns
     * @memberof Connection
     */
    count(query: CountQuery): Promise<number>;
    /**
     * insert data into table
     *
     * @template T
     * @param {InsertQuery} query
     * @returns
     * @memberof Connection
     */
    insert<T>(query: InsertQuery): Promise<number | T[]>;
    /**
     * update data into table
     *
     * @param {UpdateQuery} query
     * @returns
     * @memberof Connection
     */
    update(query: UpdateQuery): Promise<number>;
    /**
     * remove data from table
     *
     * @param {RemoveQuery} query
     * @returns
     * @memberof Connection
     */
    remove(query: RemoveQuery): Promise<number>;
    /**
     * delete all data from table
     *
     * @param {string} tableName
     * @returns
     * @memberof Connection
     */
    clear(tableName: string): Promise<void>;
    /**
     * set log status
     *
     * @param {boolean} status
     * @memberof Connection
     */
    setLogStatus(status: boolean): void;
    /**
     * get version of database
     *
     * @param {(string | DbInfo)} dbName
     * @returns
     * @memberof Connection
     */
    getDbVersion(dbName: string | DbInfo): Promise<number>;
    /**
     * is database exist
     *
     * @param {(DbInfo | string)} dbInfo
     * @returns
     * @memberof Connection
     */
    isDbExist(dbInfo: DbInfo | string): Promise<boolean>;
    /**
     * returns list of database created
     *
     * @returns
     * @memberof Connection
     */
    getDbList(): Promise<string[]>;
    /**
     * get Database Schema
     *
     * @param {string} dbName
     * @returns
     * @memberof Connection
     */
    getDbSchema(dbName: string): Promise<IDataBase>;
    /**
     * get the value from keystore table
     *
     * @template T
     * @param {string} key
     * @returns
     * @memberof Connection
     */
    get<T>(key: string): Promise<T>;
    /**
     * set the value in keystore table
     *
     * @param {string} key
     * @param {*} value
     * @returns
     * @memberof Connection
     */
    set(key: string, value: any): Promise<void>;
    /**
     * terminate the connection
     *
     * @returns
     * @memberof Connection
     */
    terminate(): Promise<void>;
    /**
     * execute transaction
     *
     * @template T
     * @param {TranscationQuery} query
     * @returns
     * @memberof Connection
     */
    transaction<T>(query: TranscationQuery): Promise<T>;
    on(event: EVENT, eventCallBack: Function): void;
    off(event: EVENT, eventCallBack: Function): void;
    union<T>(query: SelectQuery[]): Promise<T>;
    intersect<T>(query: IntersectQuery): Promise<T>;
    addPlugin(plugin: IPlugin, params?: any): void;
    addMiddleware(middleware: any): void;
    /**
     * import scripts in jsstore web worker.
     * Scripts method can be called using transaction api.
     *
     * @param {...string[]} urls
     * @returns
     * @memberof Connection
     */
    importScripts(...urls: string[]): Promise<void>;
}
