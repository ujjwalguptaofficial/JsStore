import {
    Column,
    DATA_TYPE,
    COL_OPTION
} from "jsstore";
import {
    idbCon
} from "./idb_service";
export class BaseService {

    constructor() {
        this.dbName = "students_db";
        this.connection.setLogStatus(true);
        this.initJsStore();
    }

    get connection() {
        return idbCon;
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
                new Column('id').options([COL_OPTION.PrimaryKey, COL_OPTION.AutoIncrement]),
                new Column('name').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.String),
                new Column('gender').options([COL_OPTION.NotNull]).disableSearch(),
                new Column('country').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.String),
                new Column('city').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.String)
            ]
        }

        return {
            name: this.dbName,
            tables: [studentsTable]
        }
    }
}