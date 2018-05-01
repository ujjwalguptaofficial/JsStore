import { NotWhere } from "./not_where";
export declare class In extends NotWhere {
    protected executeInLogic(column: any, values: any): void;
    private executeSkipAndLimitForIn_(column, values);
    private executeSkipForIn_(column, values);
    private executeLimitForIn_(column, values);
    private executeSimpleForIn_(column, values);
}
