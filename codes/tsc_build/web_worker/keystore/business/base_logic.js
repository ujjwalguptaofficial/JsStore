var Base = /** @class */ (function () {
    function Base() {
        this._results = null;
        this._errorOccured = false;
        this._errorCount = 0;
    }
    Base.prototype.onErrorOccured = function (e) {
        ++this._errorCount;
        if (this._errorCount === 1) {
            if (this._onError != null) {
                this._onError(e.target.error);
            }
        }
        console.error(e);
    };
    return Base;
}());
export { Base };
//# sourceMappingURL=base_logic.js.map