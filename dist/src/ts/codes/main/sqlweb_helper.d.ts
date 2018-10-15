export declare let SqlWeb: ISqlWeb;
/**
 *
 * supply sqlweb
 * @param {*} value
 */
export declare const useSqlWeb: (value: any) => void;
interface ISqlWeb {
    parseSql: (sql: string | object) => ISqlWebResult;
}
interface ISqlWebResult {
    api: string;
    data: any;
}
export {};
