import { ConnectionHelper } from "./connection_helper";
import {
    SelectQuery, CountQuery, InsertQuery, SetQuery,
    UpdateQuery, RemoveQuery, TranscationQuery,
    API, IDataBase, EVENT, IPlugin, IntersectQuery, IDbInfo, TMiddleware
} from "../common";

export class Connection extends ConnectionHelper {

    constructor(worker?: Worker) {
        super(worker);
    }

    /**
     * creates DataBase
     *
     * @param {IDataBase} dataBase
     * @returns
     * @memberof Connection
     */
    initDb(dataBase: IDataBase) {
        this.database = dataBase;
        return this.pushApi<boolean>({
            name: API.InitDb,
            query: dataBase
        });
    }

    /**
     * drop dataBase
     *
     * @returns
     * @memberof Connection
     */
    dropDb() {
        return this.pushApi<void>({
            name: API.DropDb
        });
    }

    /**
     * select data from table
     *
     * @template T
     * @param {SelectQuery} query
     * @returns
     * @memberof Connection
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
     * @memberof Connection
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
     * @template T
     * @param {InsertQuery} query
     * @returns
     * @memberof Connection
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
     * @memberof Connection
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
     * @memberof Connection
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
     * @memberof Connection
     */
    clear(tableName: string) {
        return this.pushApi<void>({
            name: API.Clear,
            query: tableName
        });
    }

    /**
     * set log status
     *
     * @param {boolean} status
     * @memberof Connection
     */
    set logStatus(status: boolean) {
        this.logger.status = status;
        this.pushApi({
            name: API.ChangeLogStatus,
            query: status
        });
    }

    /**
     * open database
     *
     * @param {string} dbName
     * @returns
     * @memberof Connection
     */
    openDb(dbName: string, version?) {
        return this.pushApi<IDataBase>({
            name: API.OpenDb,
            query: {
                version: version,
                name: dbName
            } as IDbInfo
        }).then((dataBase) => {
            this.database = dataBase;
            return dataBase;
        });
    }

    /**
     * returns list of database created
     *
     * @returns
     * @memberof Connection
     */
    getDbList(): Promise<[IDbInfo]> {
        console.warn("Api getDbList is recommended to use for debugging only. Do not use in code.");
        return (indexedDB as any).databases();
    }

    /**
     * get the value from keystore table
     *
     * @template T
     * @param {string} key
     * @returns
     * @memberof Connection
     */
    get<T>(key: string) {
        return this.pushApi<T>({
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
     * @memberof Connection
     */
    set(key: string, value: any) {
        return this.pushApi<void>({
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
     * @memberof Connection
     */
    terminate() {
        return this.pushApi<void>({
            name: API.Terminate
        });
    }

    /**
     * execute transaction
     *
     * @template T
     * @param {TranscationQuery} query
     * @returns
     * @memberof Connection
     */
    transaction<T>(query: TranscationQuery) {
        return this.pushApi<T>({
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
        if (eventCallBack) {
            const index = this.eventQueue.findIndex(q => q.event === event);
            this.eventQueue.splice(index, 0);
            return;
        }
        const indexes = [];
        this.eventQueue.forEach((ev, i) => {
            if (ev.event === event) {
                indexes.push(i);
            }
        });
        indexes.forEach(i => {
            this.eventQueue.splice(i, 1);
        });
    }

    union<T>(query: SelectQuery[]) {
        return this.pushApi<T>({
            name: API.Union,
            query
        });
    }

    intersect<T>(query: IntersectQuery) {
        return this.pushApi<T>({
            name: API.Intersect,
            query
        });
    }

    addPlugin(plugin: IPlugin, params?) {
        plugin.setup(this, params);
    }

    addMiddleware(middleware: TMiddleware) {
        this.middlewares.push(middleware);
    }

    /**
     * import scripts in jsstore web worker. 
     * Scripts method can be called using transaction api.
     * 
     * @param {...string[]} urls
     * @returns
     * @memberof Connection
     */
    importScripts(...urls: string[]) {
        return this.pushApi<void>({
            name: API.ImportScripts,
            query: urls
        });
    }
}