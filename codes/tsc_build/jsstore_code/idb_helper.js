var IdbHelper = /** @class */ (function () {
    function IdbHelper() {
    }
    IdbHelper.checkIdbSupport = function () {
        indexedDB = window.indexedDB || window.mozIndexedDB ||
            window.webkitIndexedDB || window.msIndexedDB;
        this._isIdbSupported = indexedDB ? true : false;
    };
    return IdbHelper;
}());
export { IdbHelper };
//# sourceMappingURL=idb_helper.js.map