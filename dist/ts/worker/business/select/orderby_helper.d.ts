import { GroupByHelper } from "./group_by_helper";
export declare class Helper extends GroupByHelper {
    private getOrderColumnInfo_;
    private compareAlphabetInDesc_;
    private compareAlphabetinAsc_;
    private compareNumberInDesc_;
    private compareNumberinAsc_;
    private compareDateInDesc_;
    private compareDateInAsc_;
    private getValueComparer_;
    private orderBy;
    private getOrderType;
    protected processOrderBy(): void;
    protected processAggregateQry(): void;
}
