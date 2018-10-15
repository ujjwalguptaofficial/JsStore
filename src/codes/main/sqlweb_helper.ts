/* tslint:disable-next-line */
export let SqlWeb: ISqlWeb;

/**
 *
 * supply sqlweb
 * @param {*} value
 */
export const useSqlWeb = (value) => {
    SqlWeb = value;
};

interface ISqlWeb {
    parseSql: (sql: string | object) => ISqlWebResult;
}

interface ISqlWebResult {
    api: string;
    data: any;
}