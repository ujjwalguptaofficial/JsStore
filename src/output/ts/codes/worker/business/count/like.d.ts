import { In } from "./in";
import { OCCURENCE } from "../../enums";
export declare class Like extends In {
    protected executeLikeLogic(column: any, value: any, symbol: OCCURENCE): void;
}
