import { Base } from "./index";
import { InsertQuery } from "../types";
import { IError } from "../interfaces";

export class BulkInsert extends Base {
    query: InsertQuery;

    constructor(query: InsertQuery, onSuccess: () => void, onError: (err: IError) => void) {
        super();
        this.query = query;
        this.onSuccess = onSuccess;
        this.onError = onError;
    }

    execute() {
        try {
            this.bulkinsertData(this.query.values);
            this.query.values = null;
        }
        catch (ex) {
            this.onExceptionOccured(ex, { tableName: this.query.into });
        }
    }

    private bulkinsertData(values) {
        this.createTransaction([this.query.into], () => {
            this.onSuccess();
        });
        this.objectStore = this.transaction.objectStore(this.query.into);
        const valueLength = values.length;
        if (this.query.upsert === false) {
            for (let i = 0; i < valueLength; i++) {
                this.objectStore.add(values[i]);
            }
        } else {
            for (let i = 0; i < valueLength; i++) {
                this.objectStore.put(values[i]);
            }
        }
    }
}
