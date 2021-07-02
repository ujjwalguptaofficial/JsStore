import { Base } from "@executors/base";
import { ISelectQuery } from "@/common";
import { DbMeta } from "@worker/model";
import { Select } from "@executors/select";
import { IDBUtil } from "@/worker/idbutil";

export class Union extends Base {

    constructor(query: ISelectQuery[], util: IDBUtil) {
        super();
        this.query = query as any;
        this.util = util;
    }

    execute(db: DbMeta) {
        const query: ISelectQuery[] = this.query as any;
        let index = 0;
        const hashMap = {};
        let isQueryForSameTable = true;
        const queryLength = query.length;
        query.every((qry, i) => {
            if (i + 1 < queryLength && qry.from !== query[i + 1].from) {
                isQueryForSameTable = false;
                return false;
            }
            return true;
        });
        let getHashKey;
        if (isQueryForSameTable) {
            const pKey = this.primaryKey(query[0].from);
            getHashKey = (val) => {
                return val[pKey];
            };
        }
        else {
            getHashKey = (val) => {
                let columnValKey = "";
                for (const key in val) {
                    columnValKey += val[key];
                }
                return columnValKey;
            };
        }
        let select: Select;
        const fetchData = () => {
            if (index < query.length) {
                select = new Select(query[index++], this.util);
                return select.execute().then((selectResult) => {
                    selectResult.forEach(val => {
                        hashMap[getHashKey(val)] = val;
                    });
                    return fetchData();
                })
            }
            else {
                const results = [];
                for (const key in hashMap) {
                    results.push(hashMap[key]);
                }
                return results;
            }
        };
        return fetchData();
    }


}