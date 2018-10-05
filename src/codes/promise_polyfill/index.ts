import { APromise } from "./promise";

export const addPromise = () => {
    if (typeof Promise === "undefined") {
        self['Promise'] = APromise;
    }
};