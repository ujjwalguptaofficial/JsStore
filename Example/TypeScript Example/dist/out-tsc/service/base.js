export var connection = new JsStore.Instance();
var Base = /** @class */ (function () {
    function Base() {
        this.Data_Type = JsStore.Data_Type;
    }
    Base.prototype.isDbExist = function (dbName) {
        return JsStore.isDbExist(dbName);
    };
    return Base;
}());
export { Base };
//# sourceMappingURL=P:/Users/ujjwal/Documents/projects/JsStore/Example/TypeScript Example/service/base.js.map