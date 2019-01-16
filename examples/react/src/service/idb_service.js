import * as JsStore from "jsstore";
import {
    DATA_TYPE
} from "jsstore";
import * as workerPath from 'file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js';
this.connection.setLogStatus(true);
// This will ensure that we are using only one instance. 
// Otherwise due to multiple instance multiple worker will be created.
export const idbCon = new JsStore.Instance(new Worker(workerPath));
export const dbName = "students_db";

const initJsStore = async () => {
    try {
        const isDbCreated = await idbCon.isDbExist(dbName);
        if (isDbCreated) {
            idbCon.openDb(dbName);
        } else {
            idbCon.createDb(getDbSchema());
        }

    } catch (ex) {
        console.error(ex);
    }
}

const getDbSchema = () => {
    var studentsTable = {
        name: 'students',
        columns: [{
                name: 'id',
                primaryKey: true,
                autoIncrement: true
            },
            {
                name: 'name',
                notNull: true,
                dataType: DATA_TYPE.String
            },
            {
                name: 'gender',
                dataType: DATA_TYPE.String,
                default: 'male'
            },
            {
                name: 'country',
                notNull: true,
                dataType: DATA_TYPE.String
            },
            {
                name: 'city',
                dataType: DATA_TYPE.String,
                notNull: true
            }
        ]
    }

    return {
        name: dbName,
        tables: [studentsTable]
    }
}

initJsStore();