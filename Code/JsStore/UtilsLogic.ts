namespace JsStore {
    export class Utils {
        static convertObjectintoLowerCase(obj: any) {
            var keys = Object.keys(obj);
            var n = keys.length;
            while (n--) {
                var key = keys[n];
                obj[key.toLowerCase()] = obj[key];
                delete obj[key];
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
