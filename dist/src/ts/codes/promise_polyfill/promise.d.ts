export declare class APromise {
    thenCallBack: (value: any) => void;
    catchCallBack: (value: any) => void;
    constructor(callBack: any);
    then(callBack: (value: any) => void): this;
    catch(callBack: (value: any) => void): this;
}
