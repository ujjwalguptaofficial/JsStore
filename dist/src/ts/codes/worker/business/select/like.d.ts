import { In } from "./in";
import { OCCURENCE } from "../../enums";
export declare class Like extends In {
    protected executeLikeLogic(column: any, value: string, symbol: OCCURENCE): void;
    private executeSkipAndLimit_;
    private executeSkip_;
    private executeLimit_;
    private executeSimple_;
}
