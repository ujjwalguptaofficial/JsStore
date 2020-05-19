export declare class KeyStore {
    /**
     * Initialize KeyStore
     *
     */
    static init: () => Promise<unknown>;
    static close: () => Promise<unknown>;
    /**
     * return the value by key
     *
     * @param {string} key
     * @param {(result) => void} onSuccess
     * @param {(err: IError) => void} [onError=null]
     * @returns
     */
    static get: <T>(key: string) => Promise<T>;
    /**
     * insert or update value
     *
     * @param {any} key
     * @param {any} value
     * @param {(result) => void} [onSuccess]
     * @param {(err: IError) => void} [onError]
     * @returns
     */
    static set: (key: any, value: any) => Promise<unknown>;
    /**
     * delete value
     *
     * @param {string} key
     * @param {(result) => void} [onSuccess=null]
     * @param {(err: IError) => void} [onError=null]
     * @returns
     */
    static remove: (key: string) => Promise<unknown>;
}
