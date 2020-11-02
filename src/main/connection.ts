import { ConnectionHelper } from "./connection_helper";
import {
    SelectQuery, CountQuery, InsertQuery, SetQuery,
    UpdateQuery, RemoveQuery, DbInfo, TranscationQuery,
    API, IDataBase, EVENT, IPlugin
} from "../common/index";
import { Config } from "./config";

export class Connection extends ConnectionHelper {

    constructor(worker?: Worker) {
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
        this.activeDbName = dbName;
        return this.pushApi<null>({
            name: API.OpenDb,
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
    initDb(dataBase: IDataBase) {
        this.activeDbName = dataBase.name;
        return this.pushApi<boolean>({
            name: API.InitDb,
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
            name: API.DropDb,
            query: null
        });
    }

    /**
     * select data from table
     * 
     * @template T 
     * @param {SelectQuery} query 
     * @returns 
     * @memberof Instance
     */
    select<T>(query: SelectQuery) {
        return this.pushApi<T[]>({
            name: API.Select,
            query: query
        });
    }

    /**
     * get no of record from table
     * 
     * @param {CountQuery} query 
     * @returns 
     * @memberof Instance
     */
    count(query: CountQuery) {
        return this.pushApi<number>({
            name: API.Count,
            query: query
        });
    }

    /**
     * insert data into table
     * 
     * @param {InsertQuery} query 
     * @returns 
     * @memberof Instance
     */
    insert<T>(query: InsertQuery) {
        return this.pushApi<number | T[]>({
            name: API.Insert,
            query: query
        });
    }

    /**
     * update data into table
     * 
     * @param {UpdateQuery} query 
     * @returns 
     * @memberof Instance
     */
    update(query: UpdateQuery) {
        return this.pushApi<number>({
            name: API.Update,
            query: query
        });
    }

    /**
     * remove data from table
     * 
     * @param {RemoveQuery} query 
     * @returns 
     * @memberof Instance
     */
    remove(query: RemoveQuery) {
        return this.pushApi<number>({
            name: API.Remove,
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
            name: API.Clear,
            query: tableName
        });
    }

    /**
     * set log status
     * 
     * @param {boolean} status 
     * @memberof Instance
     */
    setLogStatus(status: boolean) {
        Config.isLogEnabled = status ? status : Config.isLogEnabled;
        this.pushApi({
            name: API.ChangeLogStatus,
            query: Config.isLogEnabled
        });
    }

    /**
     * get version of database
     * 
     * @param {(string | DbInfo)} dbName 
     * @returns 
     * @memberof Instance
     */
    getDbVersion(dbName: string | DbInfo) {
        return this.pushApi<number>({
            name: API.GetDbVersion,
            query: dbName
        });
    }

    /**
     * is database exist
     * 
     * @param {(DbInfo | string)} dbInfo 
     * @returns 
     * @memberof Instance
     */
    isDbExist(dbInfo: DbInfo | string) {
        return this.pushApi<boolean>({
            name: API.IsDbExist,
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
            name: API.GetDbList,
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
        return this.pushApi<IDataBase>({
            name: API.GetDbSchema,
            query: dbName
        });
    }

    /**
     * get the value from keystore table
     * 
     * @param {string} key 
     * @returns 
     * @memberof Instance
     */
    get(key: string) {
        return this.pushApi<any>({
            name: API.Get,
            query: key
        });
    }

    /**
     * set the value in keystore table 
     * 
     * @param {string} key 
     * @param {*} value 
     * @returns 
     * @memberof Instance
     */
    set(key: string, value: any) {
        return this.pushApi<any>({
            name: API.Set,
            query: {
                key: key, value: value
            } as SetQuery
        });
    }

    /**
     * terminate the connection
     *
     * @returns
     * @memberof Instance
     */
    terminate() {
        return this.pushApi<void>({
            name: API.Terminate,
            query: null
        });
    }

    /**
     * execute the transaction
     *
     * @param {TranscationQuery} query
     * @returns
     * @memberof Instance
     */
    transaction(query: TranscationQuery) {
        if (Config.isRuningInWorker === true) {
            (query.logic as any) = query.logic.toString();
        }
        return this.pushApi<any>({
            name: API.Transaction,
            query: query
        });
    }

    on(event: EVENT, eventCallBack: Function) {
        this.eventQueue.push({
            event: event,
            callback: eventCallBack
        });
    }

    off(event: EVENT, eventCallBack: Function) {
        const indexes = this.eventQueue.map((ev, i) => {
            if (ev.event === event) {
                return i;
            }
        });
        indexes.forEach(i => {
            this.eventQueue.splice(i, 0);
        });
    }

    union<T>(query: SelectQuery[]) {
        return this.pushApi<T>({
            name: API.Union,
            query
        });
    }

    intersect<T>(query: SelectQuery[]) {
        return this.pushApi<T>({
            name: API.Intersect,
            query
        });
    }

    addPlugin(plugin: IPlugin, params?) {
        plugin.setup(this, params);
    }

    addMiddleware(middleware) {
        this.middlewares.push(middleware);
    }
}