import { IdbHelper } from "./idb_helper";
import { QUERY_OPTION } from "../../common/index";
import { DataBase } from "../model/index";

export class BaseHelper {


    regexExpression: RegExp;
    //   method helpers

    protected get activeDb(): DataBase {
        return IdbHelper.activeDb;
    }

    protected get dbConnection() {
        return IdbHelper.dbConnection;
    }

    protected get transaction() {
        return IdbHelper.transaction;
    }

    protected createTransaction(tableNames: string[], callBack: () => void, mode?) {
        IdbHelper.createTransaction(tableNames, callBack, mode);
    }

    protected regexTest(value) {
        return this.regexExpression.test(value);
    }

    protected isTableExist(tableName: string): boolean {
        const index = this.activeDb.tables.findIndex(table => table.name === tableName);
        return index >= 0;
    }

    protected getTable(tableName: string) {
        return IdbHelper.getTable(tableName);
    }

    protected getKeyRange(value, op?) {
        let keyRange: IDBKeyRange;
        switch (op) {
            case QUERY_OPTION.Between: keyRange = IDBKeyRange.bound(value.low, value.high, false, false); break;
            case QUERY_OPTION.GreaterThan: keyRange = IDBKeyRange.lowerBound(value, true); break;
            case QUERY_OPTION.GreaterThanEqualTo: keyRange = IDBKeyRange.lowerBound(value); break;
            case QUERY_OPTION.LessThan: keyRange = IDBKeyRange.upperBound(value, true); break;
            case QUERY_OPTION.LessThanEqualTo: keyRange = IDBKeyRange.upperBound(value); break;
            default: keyRange = IDBKeyRange.only(value); break;
        }
        return keyRange;
    }

    protected getPrimaryKey(tableName): string {
        const primaryKey: string = this.getTable(tableName).primaryKey;
        return primaryKey ? primaryKey : this.getKeyPath(tableName);
    }

    protected getKeyPath(tableName) {
        const transaction: IDBTransaction = this.dbConnection.transaction([tableName], "readonly"),
            objectStore = transaction.objectStore(tableName);
        return objectStore.keyPath as string;
    }
}