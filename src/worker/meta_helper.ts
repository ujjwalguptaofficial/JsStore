export class MetaHelper {
    static tableName = "JsStore_Meta";
    static autoIncrementKey(tableName: string, columnName: string) {
        return `JsStore_${tableName}_${columnName}_Value`
    }
    static dbSchema() {
        return `JsStore_DbSchema`
    }
}