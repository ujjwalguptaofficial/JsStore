export declare let SqlWeb: ISqlWeb;
interface ISqlWeb {
    parseSql: (sql: string | object) => ISqlWebResult;
}
interface ISqlWebResult {
    api: string;
    data: any;
}
export {};
