import * as JsStore from "jsstore";
const Worker = require("worker-loader?publicPath=/&name=jsstore.worker.js!../../node_modules/jsstore/dist/jsstore.worker");


import {
    DATA_TYPE,
    COL_OPTION
} from "jsstore";
export class BaseService {

    constructor() {
        this.dbName = "students_db";
        this.connection = new JsStore.Instance(new Worker());
        this.initJsStore();
    }

    initJsStore() {
        this.connection.isDbExist(this.dbName).then((exist) => {
            if (exist) {
                this.connection.openDb(this.dbName);
            } else {
                this.connection.createDb(this.getDbSchema());
            }
        }).catch(err => {
            console.error(err);
        })
    }

    getDbSchema() {
        var studentsTable = {
            name: 'students',
            columns: [
                new JsStore.Column('id').options([COL_OPTION.PrimaryKey, COL_OPTION.AutoIncrement]),
                new JsStore.Column('name').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.String),
                new JsStore.Column('gender').options([COL_OPTION.NotNull]).disableSearch(),
                new JsStore.Column('country').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.String),
                new JsStore.Column('city').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.String)
            ]
        }

        return {
            name: this.dbName,
            tables: [studentsTable]
        }
    }
}