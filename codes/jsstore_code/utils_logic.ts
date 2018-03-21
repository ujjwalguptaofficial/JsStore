import { Connection_Status } from "./enums";
import { Error_Type } from "./error_helper";
import { db_status, enable_log } from "./common_logic";
import { worker_instance } from "./CodeExecutionHelper";
import { IWebWorkerRequest } from "./interfaces";

export class Utils {
    static updateDbStatus(status: Connection_Status, err?: Error_Type) {
        if (err === undefined) {
            db_status.ConStatus = status;
        }
        else {
            db_status = {
                ConStatus: status,
                LastError: err
            };
        }
    }

    static changeLogStatus() {
        if (worker_instance) {
            worker_instance.postMessage({
                Name: 'change_log_status',
                Query: {
                    logging: enable_log
                }
            } as IWebWorkerRequest);
        }
    }
}
