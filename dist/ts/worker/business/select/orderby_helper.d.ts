import { GroupByHelper } from "./group_by_helper";
export declare class Helper extends GroupByHelper {
    processGroupDistinctAggr(): void;
    private getOrderColumnInfo_;
    private compareStringInDesc_;
    private compareStringinAsc_;
    private compareDefaultInDesc_;
    private compareDefaultinAsc_;
    private compareNumberInDesc_;
    private compareNumberinAsc_;
    private compareDateInDesc_;
    private compareDateInAsc_;
    private getValueComparer_;
    private orderBy_;
    private getOrderType_;
    protected processOrderBy(): void;
    protected processAggregateQry(): void;
}
