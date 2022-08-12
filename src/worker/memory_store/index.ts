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
            openCursor: (keyRange: IDBKeyRange, dir?) => {
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
                    key: column,
                    value: null
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
                        if (keyRange.includes(columnValue)) {
                            cursor.value = value;
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
                promiseResolve().then(_ => {
                    execute();
                });
                return cursorRequest;
            }
        }
    }
}