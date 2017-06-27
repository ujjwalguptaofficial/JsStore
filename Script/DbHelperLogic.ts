module JsStore {
    export class DbHelperLogic {


        and() {
            return this;
        }

        or() {
            return this;
        }

        doJoin = function (type: string, column1, data1, column2, data2) {
            switch (type) {
                case 'inner': return data1[column1] == data2[column2];
            }
        }

        doInner = function (query1: ITableJoin, data1, query2: ITableJoin, data2) {
            if (data1[query1.Column] == data2[query2.Column]) {
                this.Results.push([query1.Table] = data1, [query2.Table] = data2);
            }
        }
    }
}
