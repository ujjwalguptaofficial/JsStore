namespace JsStore {
    export namespace Business {
        export namespace Count {
            export class BaseCount extends Base {
                ResultCount: number = 0;
                SkipRecord;
                LimitRecord;
                CheckFlag = false;
            }
        }
    }
}