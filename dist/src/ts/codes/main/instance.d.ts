import { InstanceHelper } from "./instance_helper";
import { IDataBase, ISelect, ICount, IInsert, IUpdate, IRemove, IDbInfo, ITranscationQry } from "./interfaces";
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
     * @param {ISelect} query
     * @returns
     * @memberof Instance
     */
    select<T>(query: ISelect): Promise<T[]>;
    /**
     * get no of record from table
     *
     * @param {ICount} query
     * @returns
     * @memberof Instance
     */
    count(query: ICount): Promise<number>;
    /**
     * insert data into table
     *
     * @param {IInsert} query
     * @returns
     * @memberof Instance
     */
    insert<T>(query: IInsert): Promise<number | T[]>;
    /**
     * update data into table
     *
     * @param {IUpdate} query
     * @returns
     * @memberof Instance
     */
    update(query: IUpdate): Promise<number>;
    /**
     * remove data from table
     *
     * @param {IRemove} query
     * @returns
     * @memberof Instance
     */
    remove(query: IRemove): Promise<number>;
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
     * @param {IInsert} query
     * @returns
     * @memberof Instance
     */
    bulkInsert(query: IInsert): Promise<null>;
    /**
     *  export the result in json file
     *
     * @param {ISelect} query
     * @returns
     * @memberof Instance
     */
    exportJson(query: ISelect): Promise<null>;
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
     * @param {(string | IDbInfo)} dbName
     * @returns
     * @memberof Instance
     */
    getDbVersion(dbName: string | IDbInfo): Promise<number>;
    /**
     * is database exist
     *
     * @param {(IDbInfo | string)} dbInfo
     * @returns
     * @memberof Instance
     */
    isDbExist(dbInfo: IDbInfo | string): Promise<boolean>;
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
    terminate(): Promise<any>;
    /**
     * execute the transaction
     *
     * @param {ITranscationQry} query
     * @returns
     * @memberof Instance
     */
    transaction(query: ITranscationQry): Promise<any>;
}
