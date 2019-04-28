import { Regex } from "./regex";
export declare class Where extends Regex {
    protected executeWhereLogic(column: any, value: any, op: any, dir: any): void;
    private executeSkipAndLimitForWhere_;
    private executeSkipForWhere_;
    private executeLimitForWhere_;
    private executeSimpleForWhere_;
}
