module JsStore {
    export module Business {
        export module Select {
            export class BaseSelect extends Base {
                Results = [];
                SendResultFlag: Boolean = true;
                Sorted: boolean = false;
                SkipRecord;
                LimitRecord;
                CheckFlag = false;
            }
        }
    }
}