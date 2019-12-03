import { SelectQuery } from "../../types";
import * as Select from '../select/index';
import { IError } from "../../interfaces";

export class Union {
    execute(query: SelectQuery[], onSuccess: (results: object[]) => void, onError: (err: IError) => void) {
        let index = 0;
        const hashMap = {};
        const fetchData = () => {
            if (index < query.length) {
                new Select.Instance(query[index++], (selectResult) => {
                    selectResult.forEach(val => {
                        let columnValKey = "";
                        for (const key in val) {
                            columnValKey += val[key];
                        }
                        hashMap[columnValKey] = val;
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