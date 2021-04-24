import { LogHelper } from "./log_helper";

export const getError = (e, customError = false) => {
    if (customError) {
        e.logError();
        return (e as LogHelper).get();
    }
    else {
        let error;
        if (e.name) {
            error = new LogHelper((e.name));
            error.message = e.message;
        }
        else {
            error = new LogHelper((e as any).target.error.name);
            error.message = (e as any).target.error.message;
        }
        if (process.env.NODE_ENV === 'dev') {
            error.logError();
        }
        return error.get();
    }
}