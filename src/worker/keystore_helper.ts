// import { IdbHelper } from "./business/index";
// import { CONNECTION_STATUS, ERROR_TYPE } from "./enums";
// import { QueryExecutor } from "./index";

// let dbConnection;

// export class KeyStoreHelper {
//     static init() {
//         setDbType();
//         new QueryExecutor().checkConnectionAndExecuteLogic()
//     }

//     static get() {

//     }
// }

// const setDbType = function () {
//     if (!indexedDB) {
//         indexedDB = (self as any).mozIndexedDB ||
//             (self as any).webkitIndexedDB || (self as any).msIndexedDB;
//     }
//     if (indexedDB) {
//         IDBTransaction = IDBTransaction ||
//             (self as any).webkitIDBTransaction || (self as any).msIDBTransaction;
//         (self as any).IDBKeyRange = (self as any).IDBKeyRange ||
//             (self as any).webkitIDBKeyRange || (self as any).msIDBKeyRange;
//     }
//     else {
//         IdbHelper.dbStatus = {
//             conStatus: CONNECTION_STATUS.UnableToStart,
//             lastError: ERROR_TYPE.IndexedDbUndefined
//         };
//     }
// };