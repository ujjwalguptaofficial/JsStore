module JsStorage {
    export module Business {
        export class GateLogic {
            Results = [];
            doAnd = function (data1, data2, query: IJoin) {
                query.Relation = (query.Relation == undefined) ? '=' : query.Relation;
                switch (query.Relation) {
                    case '=': if (data1[query.Table1.Column] == data2[query.Table2.Column]) {
                        this.Results.push([query.Table1.Table] = data1, [query.Table2.Table] = data1)
                    } break;
                    default:
                }
            }
        }
    }
}