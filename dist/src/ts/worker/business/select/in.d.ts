import { NotWhere } from "./not_where";
export declare class In extends NotWhere {
    protected executeInLogic(column: any, values: any): void;
    private executeSkipAndLimitForIn_;
    private executeSkipForIn_;
    private executeLimitForIn_;
    private executeSimpleForIn_;
}
