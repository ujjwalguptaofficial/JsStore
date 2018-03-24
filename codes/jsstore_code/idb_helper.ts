export class IdbHelper {
    static _isIdbSupported;
    static checkIdbSupport() {
        indexedDB = window.indexedDB || (window as any).mozIndexedDB ||
            (window as any).webkitIndexedDB || (window as any).msIndexedDB;
        this._isIdbSupported = indexedDB ? true : false;
    }
}