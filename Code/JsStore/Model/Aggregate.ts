module JsStore {
    export module Model {
        export class Aggregate implements IAggregate {
            Max: Array<any> = [];
            Min: Array<any> = [];
            Sum: Array<any> = [];
            Count: Array<any> = [];
            Avg: Array<any> = [];
        }
    }
}
