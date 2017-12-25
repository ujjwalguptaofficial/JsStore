namespace JsStore {
    export namespace Business {
        export namespace Count {
            export class BaseCount extends Base {
                _resultCount: number = 0;
                _skipRecord;
                _limitRecord;
                _checkFlag = false;
            }
        }
    }
}