import { Connection } from "./connection";

export class Instance {

    constructor(worker?: Worker) {
        console.warn('Instance is obsolete, please use Connection. Refer - https://jsstore.net/tutorial/connection/');
        return new Connection(worker);
    }
}