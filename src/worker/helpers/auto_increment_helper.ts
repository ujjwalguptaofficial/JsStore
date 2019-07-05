import { Table } from "../model/index";
import { IdbHelper, QueryHelper } from "../business/index";
import { KeyStore } from "../keystore/index";
import { promiseAll, promise } from "../helpers/index";
import { QueryExecutor } from "../query_executor";

export const getAutoIncrementValues = (table: Table): Promise<{ [columnName: string]: number }> => {

    const autoIncColumns = table.columns.filter((col) => {
        return col.autoIncrement;
    });
    return promise((resolve, reject) => {
        promiseAll(autoIncColumns.map(column => {
            const autoIncrementKey = `JsStore_${IdbHelper.activeDb.name}_${table.name}_${column.name}_Value`;
            return KeyStore.get(autoIncrementKey);
        })).then(results => {
            const autoIncValues = {};
            for (let i = 0; i < autoIncColumns.length; i++) {
                autoIncValues[autoIncColumns[i].name] = results[i];
            }
            resolve(autoIncValues);
        }).catch(reject);
    });
};

export const setAutoIncrementValue = (table: Table, autoIncrementValue: object) => {
    const keys = Object.keys(autoIncrementValue);
    return promiseAll(keys.map((columnName) => {
        const autoIncrementKey = `JsStore_${IdbHelper.activeDb.name}_${table.name}_${columnName}_Value`;
        const value = autoIncrementValue[columnName];
        if (QueryExecutor.isTransactionQuery === true) {
            QueryHelper.autoIncrementValues[table.name][columnName] = value;
        }
        return KeyStore.set(
            autoIncrementKey,
            value
        );
    }));
};