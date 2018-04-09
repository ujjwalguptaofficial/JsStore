import { Base } from "../base";

export class BaseCount extends Base {
    _resultCount: number = 0;
    _skipRecord;
    _limitRecord;
    checkFlag = false;
}
