import { In } from "./in";
export declare class Regex extends In {
    protected executeRegexLogic(column: any, exp: RegExp): void;
    private executeSkipAndLimitForRegex_;
    private executeSkipForRegex_;
    private executeLimitForRegex_;
    private executeSimpleForRegex_;
}
