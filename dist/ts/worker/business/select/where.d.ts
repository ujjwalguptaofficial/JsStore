import { LikeRegex } from "./regex";
export declare class Where extends LikeRegex {
    private executeSkipAndLimitForWhere_;
    private executeSkipForWhere_;
    private executeLimitForWhere_;
    private executeSimpleForWhere_;
    protected executeWhereLogic(column: any, value: any, op: any, dir: any): void;
}
