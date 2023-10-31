import { API, SetQuery } from "../common";
import { Connection } from "./connection";

export class JsStoreMap {

    constructor(private con: Connection) {

    }

    /**
     * Returns the value associated to the passed key, or undefined if there is none.
     * 
     * @template T
     * @param {string} key
     * @return {*} 
     * @memberof JsStoreMap
     */
    get<T>(key: string) {
        return this.con['pushApi']<T>({
            name: API.MapGet,
            query: key
        });
    }

    /**
     * Returns a boolean indicating whether a value has been associated with the passed key in the Map object or not. 
     *
     * @param {string} key
     * @return {*} 
     * @memberof JsStoreMap
     */
    has(key: string) {
        return this.con['pushApi']<boolean>({
            name: API.MapHas,
            query: key
        });
    }

    /**
     * Sets the value for the passed key in the map store
     *
     * @param {string} key
     * @param {*} value
     * @return {*} 
     * @memberof JsStoreMap
     */
    set(key: string, value: any) {
        return this.con['pushApi']<void>({
            name: API.MapSet,
            query: {
                key: key, value: value
            } as SetQuery
        });
    }

    /**
     * delete the value by key in the map store
     *
     * @param {string} key
     * @return {*} 
     * @memberof JsStoreMap
     */
    delete(key: string) {
        return this.con['pushApi']<void>({
            name: API.MapDelete,
            query: key
        });
    }
}