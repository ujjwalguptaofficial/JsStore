import { idbCon } from "./idb_helper";

import { IError, ITable, Column, COL_OPTION, DATA_TYPE, IDataBase } from 'jsstore';

export class BaseService {

    private dbName_ = "Ts_Student_Demo";

    constructor() {
        // initiate database when a service instance is initiated
        this.initDatabase();
    }

    /**
     * create database
     * 
     * @memberof IdbService
     */
    initDatabase() {
        this.connection.isDbExist(this.dbName_).then((exist: boolean) => {
            if (exist) {
                this.connection.openDb(this.dbName_);
            }
            else {
                this.connection.createDb(this.getDatabase_());
            }
        }).catch((err: IError) => {
            console.error(err);
        });
    }

    private getDatabase_() {
        const tblStudent: ITable = {
            name: 'Students',
            columns: [
                new Column('id').options([COL_OPTION.PrimaryKey, COL_OPTION.AutoIncrement]),
                new Column('name').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.String),
                new Column('gender').options([COL_OPTION.NotNull]).disableSearch(),
                new Column('country').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.String),
                new Column('city').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.String)
            ]
        };
        const database: IDataBase = {
            name: this.dbName_,
            tables: [tblStudent]
        };

        return database;
    }

    get connection() {
        return idbCon;
    }

}
