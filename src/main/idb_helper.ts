export class IdbHelper {
    static isIdbSupported;
    static checkIdbSupport() {
        indexedDB = window.indexedDB || (window as any).mozIndexedDB ||
            (window as any).webkitIndexedDB || (window as any).msIndexedDB;
        this.isIdbSupported = indexedDB ? true : false;
    }
}