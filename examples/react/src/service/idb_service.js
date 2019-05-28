import * as JsStore from 'jsstore';
import { IDataBase, DATA_TYPE, ITable } from 'jsstore';

const getWorkerPath = () => {
    if (process.env.NODE_ENV === 'development') {
        return require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.js");
    }
    else {
        return require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js");
    }
};

// This will ensure that we are using only one instance. 
// Otherwise due to multiple instance multiple worker will be created.
const workerPath = getWorkerPath();
export const idbCon = new JsStore.Instance(new Worker(workerPath));
export const dbname = 'Demo';

const getDatabase = () => {
    const tblStudent = {
        name: 'Students',
        columns: {
            id: {
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                notNull: true,
                dataType: DATA_TYPE.String
            },
            gender: {
                dataType: DATA_TYPE.String,
                default: 'male'
            },
            country: {
                notNull: true,
                dataType: DATA_TYPE.String
            },
            city: {
                dataType: DATA_TYPE.String,
                notNull: true
            }
        }
    };
    const dataBase = {
        name: dbname,
        tables: [tblStudent]
    };
    return dataBase;
};

export const initJsStore = () => {
    try {
        const dataBase = getDatabase();
        idbCon.initDb(dataBase);
    }
    catch (ex) {
        console.error(ex);
    }
};
