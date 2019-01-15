import * as JsStore from 'jsstore';
import * as workerPath from 'file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js';
import { IDataBase, DATA_TYPE, ITable } from 'jsstore';

// This will ensure that we are using only one instance. 
// Otherwise due to multiple instance multiple worker will be created.
export const idbCon = new JsStore.Instance(new Worker(workerPath));
export const dbname = 'Angular_Demo';


const initJsStore = async () => {
  try {
    const isDbCreated = await idbCon.isDbExist(dbname);
    if (isDbCreated) {
      idbCon.openDb(dbname);
    } else {
      const dataBase = getDatabase();
      idbCon.createDb(dataBase);
    }
  }
  catch (err) {
    // this will be fired when indexedDB is not supported.
    alert(err.message);
  }

}

const getDatabase = () => {
  const tblStudent: ITable = {
    name: 'Students',
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
  };
  const dataBase: IDataBase = {
    name: dbname,
    tables: [tblStudent]
  };
  return dataBase;
}

initJsStore();