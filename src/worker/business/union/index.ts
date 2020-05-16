import * as Select from '../select/index';
import { SelectQuery, IError } from '../../../common/index';
import { Base } from '../base';


export class Union extends Base {
    execute(query: SelectQuery[], onSuccess: (results: object[]) => void, onError: (err: IError) => void) {
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
            if (index < query.length) {
                new Select.Instance(query[index++], (selectResult) => {
                    selectResult.forEach(val => {
                        hashMap[getHashKey(val)] = val;
                    });
                    fetchData();
                }, onError).execute();
            }
            else {
                const results = [];
                for (const key in hashMap) {
                    results.push(hashMap[key]);
                }
                onSuccess(results);
            }
        };
        fetchData();
    }


}