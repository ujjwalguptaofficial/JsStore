import * as Select from '../select/index';
import { SelectQuery, IError, IntersectQuery } from '../../../common/index';
import { Base } from '../base';


export class Intersect extends Base {
    execute(intersectQry: IntersectQuery, onSuccess: (results: object[]) => void, onError: (err: IError) => void) {
        let index = 0;
        let hashMap = {};
        let hashMapTemp = {};
        let isQueryForSameTable = true;
        const query = intersectQry.queries;
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
            const pKey = this.getPrimaryKey(query[0].from);
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


        const fetchData = () => {
            if (index < queryLength) {
                new Select.Instance(query[index], (selectResult) => {
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
                    fetchData();
                }, onError).execute();
            }
            else {
                const results = [];
                let resultPusher: (key: string) => void;
                let skip = intersectQry.skip;
                const limit = intersectQry.limit;
                const onFinished = () => {
                    onSuccess(results);
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
                onFinished();
            }
        };
        fetchData();
    }
}