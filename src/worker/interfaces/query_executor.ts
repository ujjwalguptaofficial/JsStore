import { DbMeta } from "@worker/model";

export interface IQueryExecutor {
    execute(beforeExecute: () => Promise<void>): Promise<any>;
    isTxQuery: boolean;

}