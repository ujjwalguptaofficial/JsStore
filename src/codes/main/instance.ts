import { LogHelper } from "./log_helper";
import { Error_Type } from "./enums";
import { InstanceHelper } from "./instance_helper";
import { IDataBase, ISelect, ICount, IInsert, IUpdate, IRemove, IDbInfo } from "./interfaces";
import { Config } from "./config";

export class Instance extends InstanceHelper {

    constructor(worker: Worker) {
        super(worker);
    }

    /**
     *  open database
     * 
     * @param {string} dbName 
     * @returns 
     * @memberof Instance
     */
    openDb(dbName: string) {
        return this.pushApi<null>({
            name: 'open_db',
            query: dbName
        });
    }

    /**
     * creates DataBase
     * 
     * @param {IDataBase} dataBase 
     * @returns 
     * @memberof Instance
     */
    createDb(dataBase: IDataBase) {
        return this.pushApi<string[]>({
            name: 'create_db',
            query: dataBase
        });
    }

    /**
     * drop dataBase
     * 
     * @returns 
     * @memberof Instance
     */
    dropDb() {
        return this.pushApi<null>({
            name: 'drop_db',
            query: null
        });
    }

    /**
     * select data from table
     * 
     * @template T 
     * @param {ISelect} query 
     * @returns 
     * @memberof Instance
     */
    select<T>(query: ISelect) {
        return this.pushApi<T[]>({
            name: 'select',
            query: query
        });
    }

    /**
     * get no of record from table
     * 
     * @param {ICount} query 
     * @returns 
     * @memberof Instance
     */
    count(query: ICount) {
        return this.pushApi<number>({
            name: 'count',
            query: query
        });
    }

    /**
     * insert data into table
     * 
     * @param {IInsert} query 
     * @returns 
     * @memberof Instance
     */
    insert(query: IInsert) {
        return this.pushApi<number>({
            name: 'insert',
            query: query
        });
    }

    /**
     * update data into table
     * 
     * @param {IUpdate} query 
     * @returns 
     * @memberof Instance
     */
    update(query: IUpdate) {
        return this.pushApi<number>({
            name: 'update',
            query: query
        });
    }

    /**
     * remove data from table
     * 
     * @param {IRemove} query 
     * @returns 
     * @memberof Instance
     */
    remove(query: IRemove) {
        return this.pushApi<number>({
            name: 'remove',
            query: query
        });
    }

    /**
     * delete all data from table
     * 
     * @param {string} tableName 
     * @returns 
     * @memberof Instance
     */
    clear(tableName: string) {
        return this.pushApi<null>({
            name: 'clear',
            query: tableName
        });
    }

    /**
     * insert bulk amount of data
     * 
     * @param {IInsert} query 
     * @returns 
     * @memberof Instance
     */
    bulkInsert(query: IInsert) {
        return this.pushApi<null>({
            name: 'bulk_insert',
            query: query
        });
    }

    /**
     *  export the result in json file
     * 
     * @param {ISelect} query 
     * @returns 
     * @memberof Instance
     */
    exportJson(query: ISelect) {
        var onSuccess = (url) => {
            var link = document.createElement("a");
            link.href = url;
            link.download = query.from + ".json";
            link.click();
        };

        return new Promise<null>((resolve, reject) => {
            this.pushApi({
                name: 'export_json',
                query: query
            }).then(url => {
                onSuccess(url);
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * set log status
     * 
     * @param {boolean} status 
     * @memberof Instance
     */
    setLogStatus(status: boolean) {
        Config._isLogEnabled = status ? status : Config._isLogEnabled;
        this.pushApi({
            name: 'enable_log',
            query: Config._isLogEnabled
        });
    }

    /**
     * get version of database
     * 
     * @param {(string | IDbInfo)} dbName 
     * @returns 
     * @memberof Instance
     */
    getDbVersion(dbName: string | IDbInfo) {
        return this.pushApi<number>({
            name: 'get_db_version',
            query: dbName
        });
    }

    /**
     * is database exist
     * 
     * @param {(IDbInfo | string)} dbInfo 
     * @returns 
     * @memberof Instance
     */
    isDbExist(dbInfo: IDbInfo | string) {
        return this.pushApi<boolean>({
            name: 'is_db_exist',
            query: dbInfo
        });
    }

    /**
     * returns list of database created
     * 
     * @returns 
     * @memberof Instance
     */
    getDbList() {
        return this.pushApi<string[]>({
            name: 'get_db_list',
            query: null
        });
    }

    /**
     * get Database Schema
     * 
     * @param {string} dbName 
     * @returns 
     * @memberof Instance
     */
    getDbSchema(dbName: string) {
        return this.pushApi<string[]>({
            name: 'get_db_schema',
            query: dbName
        });
    }

}