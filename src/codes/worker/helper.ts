import { Config } from "./config";

export class Helper {
    static getObjectFirstKey(value) {
        for (const key in value) {
            return key;
        }
        return null;
    }

    static log(msg) {
        if (Config._isLogEnabled) {
            console.log(msg);
        }
    }

    static logError(msg) {
        if (Config._isLogEnabled) {
            console.error(msg);
        }
    }
}