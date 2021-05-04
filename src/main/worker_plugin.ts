import { Connection } from "./connection";

export const workerInjector = {
    setup(connection: Connection, param) {
        connection['$worker'] = param;
    }
};