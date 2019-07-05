import { IdbHelper } from "./idb_helper";
import { QUERY_OPTION } from "../enums";
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

    protected getAllCombinationOfWord(word: string, isArray?: boolean) {
        if (isArray) {
            let results = [];
            for (let i = 0, length = word.length; i < length; i++) {
                results = results.concat(this.getCombination_(word[i]));
            }
            return results;
        }
        else {
            return this.getCombination_(word);
        }
    }

    private getCombination_(word: string) {
        const results = [];
        const doAndPushCombination = (subWord: string, chars, index: number) => {
            if (index === subWord.length) {
                results.push(chars.join(""));
            } else {
                const ch = subWord.charAt(index);
                chars[index] = ch.toLowerCase();
                doAndPushCombination(subWord, chars, index + 1);
                chars[index] = ch.toUpperCase();
                doAndPushCombination(subWord, chars, index + 1);
            }
        };
        doAndPushCombination(word, [], 0);
        return results;
    }
}