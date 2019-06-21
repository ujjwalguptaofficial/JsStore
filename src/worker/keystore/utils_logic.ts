import { CONNECTION_STATUS } from './enums';
import { IdbHelper } from './business/idb_helper';

export class Utils {

    static updateDbStatus(status: CONNECTION_STATUS, err?) {
        if (err === undefined) {
            IdbHelper.dbStatus.conStatus = status;
        }
        else {
            IdbHelper.dbStatus = {
                conStatus: status,
                lastError: err
            };
        }
    }
}
