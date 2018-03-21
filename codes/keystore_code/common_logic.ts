import { IWebWorkerRequest, IDbStatus } from "./interfaces";
import { Connection_Status } from "./enums";

export var request_queue: IWebWorkerRequest[] = [],
    table_name = "LocalStore",
    is_code_executing = false,
    db_status: IDbStatus = {
        ConStatus: Connection_Status.NotStarted,
        LastError: ""
    };