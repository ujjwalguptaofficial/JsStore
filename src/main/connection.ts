import { ConnectionHelper } from "./connection_helper";
import {
    ISelectQuery, ICountQuery, IInsertQuery, SetQuery,
    IUpdateQuery, IRemoveQuery, ITransactionQuery,
    API, IDataBase, EVENT, IPlugin, IIntersectQuery, IDbInfo, TMiddleware, promiseResolve, InitDbResult
} from "../common";
import { JsStoreMap } from "./map";

export class Connection extends ConnectionHelper {

    constructor(worker?: Worker) {
        super(worker);
    }

    /**
     * initiate DataBase
     *
     * @param {IDataBase} dataBase
     * @returns
     * @memberof Connection
     */
    initDb(dataBase: IDataBase) {
        this.database = dataBase;
        return this.pushApi({
            name: API.InitDb,
            query: dataBase
        }).then((result: InitDbResult) => {
            let promiseObj: Promise<any>;
            const db = result.database;
            if (result.isCreated) {
                if (result.oldVersion) {
                    promiseObj = this.eventBus_.emit(EVENT.Upgrade, db, result.oldVersion, result.newVersion);
                }
                else {
                    promiseObj = this.eventBus_.emit(EVENT.Create, db);
                }
            }
            return (promiseObj || promiseResolve()).then(_ => {
                return this.eventBus_.emit(EVENT.Open, db);
            }).then(_ => {
                return result.isCreated;
            });
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
     * @param {ISelectQuery} query
     * @returns
     * @memberof Connection
     */
    select<T>(query: ISelectQuery) {
        return this.pushApi<T[]>({
            name: API.Select,
            query: query
        });
    }

    /**
     * get no of record from table
     *
     * @param {ICountQuery} query
     * @returns
     * @memberof Connection
     */
    count(query: ICountQuery) {
        return this.pushApi<number>({
            name: API.Count,
            query: query
        });
    }

    /**
     * insert data into table
     *
     * @template T
     * @param {IInsertQuery} query
     * @returns
     * @memberof Connection
     */
    insert<T>(query: IInsertQuery) {
        return this.pushApi<number | T[]>({
            name: API.Insert,
            query: query
        });
    }

    /**
     * update data into table
     *
     * @param {IUpdateQuery} query
     * @returns
     * @memberof Connection
     */
    update(query: IUpdateQuery) {
        return this.pushApi<number>({
            name: API.Update,
            query: query
        });
    }

    /**
     * remove data from table
     *
     * @param {IRemoveQuery} query
     * @returns
     * @memberof Connection
     */
    remove(query: IRemoveQuery) {
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
     * stores data in the key value format
     *
     * @memberof Connection
     */
    // tslint:disable-next-line
    Map = new JsStoreMap(this);

    /**
     * get the value from keystore table
     *
     * @template T
     * @param {string} key
     * @returns
     * @memberof Connection
     */
    get<T>(key: string) {
        console.warn(`This API is obsolete, please use Map`);
        return this.Map.get<T>(key);
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
        console.warn(`This API is obsolete, please use Map`);
        return this.Map.set(key, value);
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
     * @param {ITransactionQuery} query
     * @returns
     * @memberof Connection
     */
    transaction<T>(query: ITransactionQuery) {
        return this.pushApi<T>({
            name: API.Transaction,
            query: query
        });
    }

    on(event: EVENT, eventCallBack: Function) {
        this.eventBus_.on(event, eventCallBack);
    }

    off(event: EVENT, eventCallBack: Function) {
        this.eventBus_.off(event, eventCallBack);
    }

    union<T>(query: ISelectQuery[]) {
        return this.pushApi<T>({
            name: API.Union,
            query
        });
    }

    intersect<T>(query: IIntersectQuery) {
        return this.pushApi<T>({
            name: API.Intersect,
            query
        });
    }

    addPlugin(plugin: IPlugin, params?) {
        return plugin.setup(this, params);
    }

    addMiddleware(middleware: TMiddleware | string, forWorker: boolean) {
        if (forWorker) {
            return this.pushApi({
                name: API.Middleware,
                query: middleware
            });
        }
        this.middlewares.push(middleware as TMiddleware);
        return Promise.resolve();
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