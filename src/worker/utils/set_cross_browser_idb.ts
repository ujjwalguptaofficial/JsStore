export const setCrossBrowserIndexedDb = () => {
    try {
        if (!indexedDB) {
            indexedDB = (self as any).mozIndexedDB ||
                (self as any).webkitIndexedDB || (self as any).msIndexedDB;
        }
        if (indexedDB) {
            IDBTransaction = IDBTransaction ||
                (self as any).webkitIDBTransaction || (self as any).msIDBTransaction;
            (self as any).IDBKeyRange = (self as any).IDBKeyRange ||
                (self as any).webkitIDBKeyRange || (self as any).msIDBKeyRange;
        }
        else {
            return false;
        }
    } catch (ex) {
        return false;
    }
    return true;
};