namespace JsStore {
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
}
