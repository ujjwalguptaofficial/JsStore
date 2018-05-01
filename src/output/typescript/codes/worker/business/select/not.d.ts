import { NotWhere } from "./not_where";
export declare class Not extends NotWhere {
    compValue: string;
    protected executeLikeLogic_(column: any, value: string): void;
    private executeSkipAndLimit_();
    private executeSkip_();
    private executeLimit_();
    private executeSimple_();
}
