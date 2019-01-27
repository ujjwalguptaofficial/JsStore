import { InstanceHelper } from "./instance_helper";
import { SelectQuery, CountQuery, InsertQuery, UpdateQuery, RemoveQuery, DbInfo, TranscationQuery } from "./types";
import { IDataBase } from "./interfaces";
export declare class Instance extends InstanceHelper {
    constructor(worker?: Worker);
    /**
     *  open database
     *
     * @param {string} dbName
     * @returns
     * @memberof Instance
     */
    openDb(dbName: string): Promise<null>;
    /**
     * creates DataBase
     *
     * @param {IDataBase} dataBase
     * @returns
     * @memberof Instance
     */
    createDb(dataBase: IDataBase): Promise<string[]>;
    /**
     * drop dataBase
     *
     * @returns
     * @memberof Instance
     */
    dropDb(): Promise<null>;
    /**
     * select data from table
     *
     * @template T
     * @param {SelectQuery} query
     * @returns
     * @memberof Instance
     */
    select<T>(query: SelectQuery): Promise<T[]>;
    /**
     * get no of record from table
     *
     * @param {CountQuery} query
     * @returns
     * @memberof Instance
     */
    count(query: CountQuery): Promise<number>;
    /**
     * insert data into table
     *
     * @param {InsertQuery} query
     * @returns
     * @memberof Instance
     */
    insert<T>(query: InsertQuery): Promise<number | T[]>;
    /**
     * update data into table
     *
     * @param {UpdateQuery} query
     * @returns
     * @memberof Instance
     */
    update(query: UpdateQuery): Promise<number>;
    /**
     * remove data from table
     *
     * @param {RemoveQuery} query
     * @returns
     * @memberof Instance
     */
    remove(query: RemoveQuery): Promise<number>;
    /**
     * delete all data from table
     *
     * @param {string} tableName
     * @returns
     * @memberof Instance
     */
    clear(tableName: string): Promise<null>;
    /**
     * insert bulk amount of data
     *
     * @param {InsertQuery} query
     * @returns
     * @memberof Instance
     */
    bulkInsert(query: InsertQuery): Promise<null>;
    /**
     *  export the result in json file
     *
     * @param {SelectQuery} query
     * @returns
     * @memberof Instance
     */
    exportJson(query: SelectQuery): Promise<null>;
    /**
     * set log status
     *
     * @param {boolean} status
     * @memberof Instance
     */
    setLogStatus(status: boolean): void;
    /**
     * get version of database
     *
     * @param {(string | DbInfo)} dbName
     * @returns
     * @memberof Instance
     */
    getDbVersion(dbName: string | DbInfo): Promise<number>;
    /**
     * is database exist
     *
     * @param {(DbInfo | string)} dbInfo
     * @returns
     * @memberof Instance
     */
    isDbExist(dbInfo: DbInfo | string): Promise<boolean>;
    /**
     * returns list of database created
     *
     * @returns
     * @memberof Instance
     */
    getDbList(): Promise<string[]>;
    /**
     * get Database Schema
     *
     * @param {string} dbName
     * @returns
     * @memberof Instance
     */
    getDbSchema(dbName: string): Promise<IDataBase>;
    /**
     * get the value from keystore table
     *
     * @param {string} key
     * @returns
     * @memberof Instance
     */
    get(key: string): Promise<any>;
    /**
     * set the value in keystore table
     *
     * @param {string} key
     * @param {*} value
     * @returns
     * @memberof Instance
     */
    set(key: string, value: any): Promise<any>;
    /**
     * terminate the connection
     *
     * @returns
     * @memberof Instance
     */
    terminate(): Promise<void>;
    /**
     * execute the transaction
     *
     * @param {TranscationQuery} query
     * @returns
     * @memberof Instance
     */
    transaction(query: TranscationQuery): Promise<any>;
    /**
     * run sql code
     *
     * @param {(string | object)} query
     * @returns {Promise<any>}
     * @memberof Instance
     */
    runSql(query: string | object): Promise<any>;
}
