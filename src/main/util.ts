import { ISqlWeb } from "./interfaces";


export class Util {
    private static sqlWeb_: ISqlWeb;

    static get sqlWeb() {
        return Util.sqlWeb_ == null ? window['SqlWeb'] : Util.sqlWeb_;
    }

    static set sqlWeb(value) {
        Util.sqlWeb_ = value;
    }


}