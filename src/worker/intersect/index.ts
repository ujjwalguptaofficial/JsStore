import { IntersectQuery, SelectQuery } from "@/common";
import { Base } from "@executors/base";
import { Select } from "@executors/select";
import { DbMeta } from "../model";

export class Intersect extends Base {

    constructor(intersectQry: IntersectQuery, util) {
        super();
        this.query = intersectQry as any;
        this.util = util;
    }

    execute(db: DbMeta) {
        this.db = db;
        const intersectQry: IntersectQuery = this.query as any;
        let index = 0;
        let hashMap = {};
        let hashMapTemp = {};
        let isQueryForSameTable = true;
        const queries = intersectQry.queries;
        const queryLength = queries.length;
        queries.every((qry, i) => {
            if (i + 1 < queryLength && qry.from !== queries[i + 1].from) {
                isQueryForSameTable = false;
                return false;
            }
            return true;
        });
        let getHashKey;
        if (isQueryForSameTable) {
            const pKey = this.primaryKey(queries[0].from);
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
            if (index < queryLength) {
                select = new Select(queries[index], this.util);
                return select.execute(this.db).then((selectResult) => {
                    hashMap = {};
                    selectResult.forEach(val => {
                        const columnValKey = getHashKey(val);
                        if (index === 0) {
                            hashMapTemp[columnValKey] = val;
                        } else if (hashMapTemp[columnValKey] != null) {
                            hashMap[columnValKey] = val;
                        }
                    });
                    if (index > 0) {
                        hashMapTemp = { ...hashMap };
                    }

                    ++index;
                    return fetchData();
                })
            }
            else {
                const results = [];
                let resultPusher: (key: string) => void;
                let skip = intersectQry.skip;
                const limit = intersectQry.limit;
                const onFinished = () => {
                    select['results'] = results;
                    Object.assign(select.query, {
                        order: intersectQry.order,
                        join: {} as any
                    } as SelectQuery);
                    select.processOrderBy();
                    select.processGroupDistinctAggr();
                    return (select['results']);
                };
                let shouldStopLoop = false;
                let key: string;
                const pushResult = () => {
                    results.push(hashMap[key]);
                };
                const checkLimitAndPush = () => {
                    if (results.length < limit) {
                        pushResult();
                    }
                    else {
                        shouldStopLoop = true;
                    }
                };
                const skipChecker = (callBack: () => void) => {
                    if (skip === 0) {
                        callBack();
                    }
                    else {
                        --skip;
                    }
                };
                if (intersectQry.skip && intersectQry.limit) {
                    resultPusher = () => {
                        skipChecker(() => {
                            checkLimitAndPush();
                        });
                    };

                }
                else if (intersectQry.limit) {
                    resultPusher = checkLimitAndPush;
                }
                else if (intersectQry.skip) {
                    resultPusher = () => {
                        skipChecker(() => {
                            pushResult();
                        });
                    };
                }
                else {
                    resultPusher = () => {
                        pushResult();
                    };
                }
                if (limit) {
                    for (key in hashMap) {
                        resultPusher(key);
                        if (shouldStopLoop) {
                            break;
                        }
                    }
                }
                else {
                    for (key in hashMap) {
                        resultPusher(key);
                    }
                }
                return onFinished();
            }
        };
        return fetchData();
    }
}