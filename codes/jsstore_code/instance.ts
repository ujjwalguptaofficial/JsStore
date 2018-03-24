import { LogHelper } from "./log_helper";
import { Error_Type } from "./enums";
import { InstanceHelper } from "./instance_.helper";
import { IDataBaseOption, ISelect, ICount, IInsert, IUpdate, IRemove, IDbInfo } from "./interfaces";
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
            Name: 'open_db',
            Query: dbName
        });
    }

    /**
     * creates DataBase
     * 
     * @param {IDataBaseOption} dataBase 
     * @returns 
     * @memberof Instance
     */
    createDb(dataBase: IDataBaseOption) {
        return this.pushApi<string[]>({
            Name: 'create_db',
            Query: dataBase
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
            Name: 'drop_db',
            Query: null
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
            Name: 'select',
            Query: query
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
            Name: 'count',
            Query: query
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
            Name: 'insert',
            Query: query
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
            Name: 'update',
            Query: query
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
            Name: 'remove',
            Query: query
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
            Name: 'clear',
            Query: tableName
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
            Name: 'bulk_insert',
            Query: query
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
            link.download = query.From + ".json";
            link.click();
        };

        return new Promise<null>((resolve, reject) => {
            this.pushApi({
                Name: 'export_json',
                Query: query
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
            Name: 'enable_log',
            Query: Config._isLogEnabled
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
            Name: 'get_db_version',
            Query: dbName
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
            Name: 'is_db_exist',
            Query: dbInfo
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
            Name: 'get_db_list',
            Query: null
        });
    }

}