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
var BaseSelect = /** @class */ (function (_super) {
    __extends(BaseSelect, _super);
    function BaseSelect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._results = [];
        _this._sorted = false;
        _this._checkFlag = false;
        return _this;
    }
    BaseSelect.prototype.removeDuplicates = function () {
        var datas = this._results;
        // free results memory
        this._results = undefined;
        var key = this.getPrimaryKey(this._query.from);
        var lookupObject = {};
        for (var i in datas) {
            lookupObject[datas[i][key]] = datas[i];
        }
        // free datas memory
        datas = [];
        for (i in lookupObject) {
            datas.push(lookupObject[i]);
        }
        this._results = datas;
    };
    BaseSelect.prototype.onQueryFinished = function () {
        // ff
    };
    return BaseSelect;
}(Base));
export { BaseSelect };
//# sourceMappingURL=base_select.js.map