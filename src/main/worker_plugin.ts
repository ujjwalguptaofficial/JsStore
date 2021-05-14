import { Connection } from "./connection";

export const workerInjector = {
    setup(connection: Connection, param: any) {
        connection['$worker'] = param;
    }
};