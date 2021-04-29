import { LogHelper, getError } from "@worker/utils";
import { ERROR_TYPE, promise } from "@/common";

export class DropDb {

    execute(dbName: string) {
        return promise((res, rej) => {
            const dropDbRequest = indexedDB.deleteDatabase(dbName);
            dropDbRequest.onblocked = () => {
                const err = new LogHelper(ERROR_TYPE.DbBlocked);
                return rej(
                    getError(err, true)
                );
            };
            dropDbRequest.onerror = (e) => {
                return rej(
                    getError(e)
                )
            };
            dropDbRequest.onsuccess = () => {
                res();
            };
        })
    }
}
