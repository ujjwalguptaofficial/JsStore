import * as Select from '../select/index';
import { SelectQuery, IError } from '../../../common/index';


export class Intersect {
    execute(query: SelectQuery[], onSuccess: (results: object[]) => void, onError: (err: IError) => void) {
        let index = 0;
        let hashMap = {};
        let hashMapTemp = {};
        // const pKey = this.getPrimaryKey(this.query.from);
        const fetchData = () => {
            if (index < query.length) {
                new Select.Instance(query[index], (selectResult) => {
                    debugger;
                    hashMap = {};
                    selectResult.forEach(val => {
                        let columnValKey = "";
                        for (const key in val) {
                            columnValKey += val[key];
                        }

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
                for (const key in hashMap) {
                    results.push(hashMap[key]);
                }
                onSuccess(results);
            }
        };
        fetchData();
    }
}