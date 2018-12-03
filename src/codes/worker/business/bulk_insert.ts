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
        // if (!Array.isArray(this.query.values)) {
        //     this.onErrorOccured(
        //         new LogHelper(ERROR_TYPE.NotArray),
        //         true
        //     );
        // }
        // else if (this.isTableExist(this.query.into) === true) {
            try {
                this.bulkinsertData(this.query.values);
                this.query.values = null;
            }
            catch (ex) {
                this.onExceptionOccured(ex, { TableName: this.query.into });
            }
        // }
        // else {
        //     const error = new LogHelper(ERROR_TYPE.TableNotExist, { TableName: this.query.into });
        //     error.throw();
        // }
    }

    private bulkinsertData(values) {
        this.createTransaction([this.query.into], () => {
            this.onSuccess();
        });
        this.objectStore = this.transaction.objectStore(this.query.into);
        for (let i = 0, length = values.length; i < length; i++) {
            this.objectStore.add(values[i]);
        }
    }
}
