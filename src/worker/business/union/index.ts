import { Base } from "../base";
import { SelectQuery } from "../../types";
import { promiseAll } from "../../helpers/index";
import * as Select from '../select/index';
import { IError } from "../../interfaces";

export class Union extends Base {
    execute(query: SelectQuery[], onSuccess: (results: object[]) => void, onError: (err: IError) => void) {
        let index = 0;
        const hashMap = {};
        const columns = this.getTable(query[0].from).columns;
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