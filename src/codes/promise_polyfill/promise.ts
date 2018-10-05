export class APromise {
    thenCallBack: (value) => void;
    catchCallBack: (value) => void;

    constructor(callBack) {
        const resolve = (value) => {
            if (this.thenCallBack != null) {
                this.thenCallBack(value);
            }
        };

        const reject = (value) => {
            if (this.catchCallBack != null) {
                this.catchCallBack(value);
            }
        };

        // execute the callback
        try {
            setTimeout(() => {
                callBack(resolve, reject);
            }, 0);

        }
        catch (ex) {
            reject(ex);
        }

    }

    then(callBack: (value) => void) {
        this.thenCallBack = callBack;
        return this;
    }

    catch(callBack: (value) => void) {
        this.catchCallBack = callBack;
        return this;
    }

}