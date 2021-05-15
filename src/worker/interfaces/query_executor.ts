import { DbMeta } from "@worker/model";

export interface IQueryExecutor {
    execute(db: DbMeta): Promise<any>;
    isTxQuery: boolean;

}