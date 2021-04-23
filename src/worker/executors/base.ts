import { IDBUtil } from "@worker/idb_util";
import { InsertQuery } from "@/common";
import { LogHelper } from "@worker/utils";

export class Base {
    idbUtil: IDBUtil;
    query: InsertQuery;
    onSuccess: (result: any) => void;
    onError: (err: LogHelper) => void;
}