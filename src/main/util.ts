import { ISqlWeb } from "../common/index";

 

export class Util {
    private static sqlWeb_: ISqlWeb;

    static get sqlWeb() {
        return Util.sqlWeb_ == null ? self['SqlWeb'] : Util.sqlWeb_;
    }

    static set sqlWeb(value) {
        Util.sqlWeb_ = value;
    }


}