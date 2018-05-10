import { BaseSelect } from "./base_select";
export declare class NotWhere extends BaseSelect {
    protected executeWhereUndefinedLogic(): void;
    private executeSkipAndLimitForNoWhere_();
    private executeSkipForNoWhere_();
    private executeSimpleForNotWhere_();
    private executeLimitForNotWhere_();
}
