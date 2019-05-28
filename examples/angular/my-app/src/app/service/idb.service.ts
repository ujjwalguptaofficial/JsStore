import * as JsStore from 'jsstore';
import * as workerPath from 'file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js';
import { IDataBase, DATA_TYPE, ITable } from 'jsstore';

// This will ensure that we are using only one instance. 
// Otherwise due to multiple instance multiple worker will be created.
export const idbCon = new JsStore.Instance(new Worker(workerPath));
export const dbname = 'Angular_Demo';




const getDatabase = () => {
  const tblStudent: ITable = {
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
  const dataBase: IDataBase = {
    name: dbname,
    tables: [tblStudent]
  };
  return dataBase;
};

export const initJsStore = () => {
  const dataBase = getDatabase();
  idbCon.initDb(dataBase);
};
