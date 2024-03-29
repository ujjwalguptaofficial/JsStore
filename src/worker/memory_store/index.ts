import { promiseResolve } from "@/common";
import { getKeys } from "../utils";

export class MemoryObjectStore {
    data: any[];

    constructor(data: any[]) {
        this.data = data;
    }

    get indexNames() {
        const keys = getKeys(this.data[0])
        return {
            contains(columnName: string) {
                return keys.indexOf(columnName) >= 0;
            }
        }
    }

    index(column: string) {
        return {
            openCursor: (keyRange?: IDBKeyRange) => {
                const cursorRequest = {

                } as {
                    onsuccess: Function,
                    onerror: Function
                }
                let index = 0;
                const cursor = {
                    continue() {
                        ++index;
                        execute();
                    },
                }
                const callOnSuccess = (result) => {
                    cursorRequest.onsuccess({
                        target: {
                            result
                        }
                    });
                }
                const execute = () => {
                    const value = this.data[index];
                    if (value) {
                        const columnValue = value[column];
                        if (columnValue && (keyRange == null || keyRange.includes(columnValue))) {
                            (cursor as any).key = columnValue;
                            (cursor as any).value = value;
                            callOnSuccess(cursor)
                        }
                        else {
                            cursor.continue();
                        }
                    }
                    else {
                        callOnSuccess(null);
                    }
                }
                promiseResolve().then(execute);
                return cursorRequest;
            }
        }
    }
}