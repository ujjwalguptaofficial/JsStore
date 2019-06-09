import { Base } from "./base";
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
            this.onExceptionOccured(ex);
        }
    }

    private bulkinsertData(values) {
        this.createTransaction([this.query.into], () => {
            this.onSuccess();
        });
        this.objectStore = this.transaction.objectStore(this.query.into);
        const processName = this.query.upsert === true ? "put" : "add";
        for (let i = 0, valueLength = values.length; i < valueLength; i++) {
            this.objectStore[processName](values[i]);
        }
    }
}
