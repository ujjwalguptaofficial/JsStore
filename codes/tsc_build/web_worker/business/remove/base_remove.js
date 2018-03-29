var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Base } from "../base";
var BaseRemove = /** @class */ (function (_super) {
    __extends(BaseRemove, _super);
    function BaseRemove() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._checkFlag = false;
        return _this;
    }
    BaseRemove.prototype.onQueryFinished = function () {
        // ff
    };
    return BaseRemove;
}(Base));
export { BaseRemove };
//# sourceMappingURL=base_remove.js.map