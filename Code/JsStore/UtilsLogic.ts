namespace JsStore {
    export class Utils {

        static convertObjectintoLowerCase(obj: any) {
            var keys = Object.keys(obj);
            var n = keys.length;
            while (n--) {
                var key = keys[n];
                obj[key.toLowerCase()] = obj[key];
                delete obj[key];
            }
        }

        /**
         * determine and set the DataBase Type
         * 
         * 
         * @memberOf MainLogic
         */
        static setDbType = function () {
            (self as any).indexedDB = self.indexedDB || (self as any).mozIndexedDB ||
                (self as any).webkitIndexedDB || (self as any).msIndexedDB;
            if (indexedDB) {
                (self as any).IDBTransaction = (self as any).IDBTransaction || (self as any).webkitIDBTransaction ||
                    (self as any).msIDBTransaction;
                (self as any).IDBKeyRange = (self as any).IDBKeyRange || (self as any).webkitIDBKeyRange ||
                    (self as any).msIDBKeyRange;
            }
            else {
                throwError('Your browser doesnot support IndexedDb');
            }
        };
    }
}
