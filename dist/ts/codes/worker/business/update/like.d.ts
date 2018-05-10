import { OCCURENCE } from "../../enums";
import { In } from "./in";
export declare class Like extends In {
    protected executeLikeLogic(column: any, value: any, symbol: OCCURENCE): void;
}
