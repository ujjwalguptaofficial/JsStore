import { Instance } from 'jsstore';
declare var JsStore;

export var connection: Instance = new JsStore.Instance();
export class Base {

    Data_Type = JsStore.Data_Type;

    isDbExist(dbName) {
        return JsStore.isDbExist(dbName);
    }

}
