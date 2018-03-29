var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { InstanceHelper } from "./instance_helper";
import { Config } from "./config";
var Instance = /** @class */ (function (_super) {
    __extends(Instance, _super);
    function Instance(worker) {
        return _super.call(this, worker) || this;
    }
    /**
     *  open database
     *
     * @param {string} dbName
     * @returns
     * @memberof Instance
     */
    Instance.prototype.openDb = function (dbName) {
        return this.pushApi({
            Name: 'open_db',
            Query: dbName
        });
    };
    /**
     * creates DataBase
     *
     * @param {IDataBaseOption} dataBase
     * @returns
     * @memberof Instance
     */
    Instance.prototype.createDb = function (dataBase) {
        return this.pushApi({
            Name: 'create_db',
            Query: dataBase
        });
    };
    /**
     * drop dataBase
     *
     * @returns
     * @memberof Instance
     */
    Instance.prototype.dropDb = function () {
        return this.pushApi({
            Name: 'drop_db',
            Query: null
        });
    };
    /**
     * select data from table
     *
     * @template T
     * @param {ISelect} query
     * @returns
     * @memberof Instance
     */
    Instance.prototype.select = function (query) {
        return this.pushApi({
            Name: 'select',
            Query: query
        });
    };
    /**
     * get no of record from table
     *
     * @param {ICount} query
     * @returns
     * @memberof Instance
     */
    Instance.prototype.count = function (query) {
        return this.pushApi({
            Name: 'count',
            Query: query
        });
    };
    /**
     * insert data into table
     *
     * @param {IInsert} query
     * @returns
     * @memberof Instance
     */
    Instance.prototype.insert = function (query) {
        return this.pushApi({
            Name: 'insert',
            Query: query
        });
    };
    /**
     * update data into table
     *
     * @param {IUpdate} query
     * @returns
     * @memberof Instance
     */
    Instance.prototype.update = function (query) {
        return this.pushApi({
            Name: 'update',
            Query: query
        });
    };
    /**
     * remove data from table
     *
     * @param {IRemove} query
     * @returns
     * @memberof Instance
     */
    Instance.prototype.remove = function (query) {
        return this.pushApi({
            Name: 'remove',
            Query: query
        });
    };
    /**
     * delete all data from table
     *
     * @param {string} tableName
     * @returns
     * @memberof Instance
     */
    Instance.prototype.clear = function (tableName) {
        return this.pushApi({
            Name: 'clear',
            Query: tableName
        });
    };
    /**
     * insert bulk amount of data
     *
     * @param {IInsert} query
     * @returns
     * @memberof Instance
     */
    Instance.prototype.bulkInsert = function (query) {
        return this.pushApi({
            Name: 'bulk_insert',
            Query: query
        });
    };
    /**
     *  export the result in json file
     *
     * @param {ISelect} query
     * @returns
     * @memberof Instance
     */
    Instance.prototype.exportJson = function (query) {
        var _this = this;
        var onSuccess = function (url) {
            var link = document.createElement("a");
            link.href = url;
            link.download = query.from + ".json";
            link.click();
        };
        return new Promise(function (resolve, reject) {
            _this.pushApi({
                Name: 'export_json',
                Query: query
            }).then(function (url) {
                onSuccess(url);
                resolve();
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * set log status
     *
     * @param {boolean} status
     * @memberof Instance
     */
    Instance.prototype.setLogStatus = function (status) {
        Config._isLogEnabled = status ? status : Config._isLogEnabled;
        this.pushApi({
            Name: 'enable_log',
            Query: Config._isLogEnabled
        });
    };
    /**
     * get version of database
     *
     * @param {(string | IDbInfo)} dbName
     * @returns
     * @memberof Instance
     */
    Instance.prototype.getDbVersion = function (dbName) {
        return this.pushApi({
            Name: 'get_db_version',
            Query: dbName
        });
    };
    /**
     * is database exist
     *
     * @param {(IDbInfo | string)} dbInfo
     * @returns
     * @memberof Instance
     */
    Instance.prototype.isDbExist = function (dbInfo) {
        return this.pushApi({
            Name: 'is_db_exist',
            Query: dbInfo
        });
    };
    /**
     * returns list of database created
     *
     * @returns
     * @memberof Instance
     */
    Instance.prototype.getDbList = function () {
        return this.pushApi({
            Name: 'get_db_list',
            Query: null
        });
    };
    /**
     * get Database Schema
     *
     * @param {string} dbName
     * @returns
     * @memberof Instance
     */
    Instance.prototype.getDbSchema = function (dbName) {
        return this.pushApi({
            Name: 'get_db_schema',
            Query: dbName
        });
    };
    return Instance;
}(InstanceHelper));
export { Instance };
//# sourceMappingURL=instance.js.map