import * as JsStore from '../index';
import { CONNECTION_STATUS } from './enums';
export declare class Utils {
    /**
     * determine and set the DataBase Type
     *
     *
     * @memberOf UtilityLogic
     */
    static setDbType(): void;
    static updateDbStatus(status: CONNECTION_STATUS, err?: JsStore.ERROR_TYPE): void;
}
