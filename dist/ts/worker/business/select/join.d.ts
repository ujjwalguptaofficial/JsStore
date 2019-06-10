import { Helper } from "./orderby_helper";
export declare class Join extends Helper {
    private joinQueryStack_;
    private currentQueryStackIndex_;
    tablesFetched: any[];
    executeJoinQuery(): void;
    private onJoinQueryFinished_;
    private startExecutingJoinLogic_;
    private jointables;
    private getJoinTableInfo_;
    private checkJoinQuery_;
}
