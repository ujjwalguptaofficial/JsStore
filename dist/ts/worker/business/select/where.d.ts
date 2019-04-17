import { LikeRegex } from "./regex";
export declare class Where extends LikeRegex {
    protected executeWhereLogic(column: any, value: any, op: any, dir: any): void;
    private executeSkipAndLimitForWhere_;
    private executeSkipForWhere_;
    private executeLimitForWhere_;
    private executeSimpleForWhere_;
}
