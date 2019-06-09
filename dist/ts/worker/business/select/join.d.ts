import { Helper } from "./orderby_helper";
export declare class Join extends Helper {
    private joinQueryStack_;
    private currentQueryStackIndex_;
    tablesFetched: any[];
    executeJoinQuery(): void;
    private onError_;
    private onJoinQueryFinished_;
    private startExecutionJoinLogic_;
    private jointables;
    private getJoinTableInfo_;
    private checkJoinTableShema;
}
