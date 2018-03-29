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
import { BaseSelect } from "./base_select";
import * as Select from './instance';
var Join = /** @class */ (function (_super) {
    __extends(Join, _super);
    function Join(query, onSuccess, onError) {
        var _this = _super.call(this) || this;
        _this._queryStack = [];
        _this._currentQueryStackIndex = 0;
        _this._onSuccess = onSuccess;
        _this._onError = onError;
        _this._query = query;
        var table_list = []; // used to open the multiple object store
        var convertQueryIntoStack = function (qry) {
            if (qry.hasOwnProperty('Table1')) {
                qry.Table2['JoinType'] = qry.join === undefined ?
                    'inner' : qry.join.toLowerCase();
                this._queryStack.push(qry.Table2);
                if (this._queryStack.length % 2 === 0) {
                    this._queryStack[this._queryStack.length - 1].NextJoin = qry.NextJoin;
                }
                table_list.push(qry.Table2.Table);
                return convertQueryIntoStack(qry.Table1);
            }
            else {
                this._queryStack.push(qry);
                table_list.push(qry.Table);
                return;
            }
        }.bind(_this);
        convertQueryIntoStack(query.from);
        _this._queryStack.reverse();
        // get the data for first table
        if (!_this._errorOccured) {
            var select_object = new Select.Instance({
                from: _this._queryStack[0].table,
                where: _this._queryStack[0].where
            }, function (results) {
                var table_name = this._queryStack[0].Table;
                results.forEach(function (item, index) {
                    this._results[index] = {};
                    this._results[index][table_name] = item;
                }, this);
                this.startExecutionJoinLogic();
            }.bind(_this), _this.onErrorOccured.bind(_this));
            select_object.execute();
        }
        return _this;
    }
    Join.prototype.onTransactionCompleted = function (e) {
        if (this._onSuccess != null && (this._queryStack.length === this._currentQueryStackIndex + 1)) {
            if (this._query['Count']) {
                this._onSuccess(this._results.length);
            }
            else {
                if (this._query['Skip'] && this._query['Limit']) {
                    this._results.splice(0, this._query['Skip']);
                    this._results.splice(this._query['Limit'] - 1, this._results.length);
                }
                else if (this._query['Skip']) {
                    this._results.splice(0, this._query['Skip']);
                }
                else if (this._query['Limit']) {
                    this._results.splice(this._query['Limit'] - 1, this._results.length);
                }
                this._onSuccess(this._results);
            }
        }
    };
    Join.prototype.executeWhereJoinLogic = function (joinQuery, query) {
        var results = [], join_index = 0, column = query.column, tmp_results = this._results, item, result_length = tmp_results.length;
        // get the data from query table
        var select_object = new Select.Instance({
            from: query.table,
            order: query.order,
            where: query.where
        }, function (selectResults) {
            // perform join
            selectResults.forEach(function (value, index) {
                // search item through each global result
                for (var i = 0; i < result_length; i++) {
                    item = tmp_results[i][joinQuery.table][joinQuery.column];
                    doJoin(item, value, i);
                }
            });
            this._results = results;
            // check if further execution needed
            if (this._queryStack.length > this._currentQueryStackIndex + 1) {
                this.startExecutionJoinLogic();
            }
            else {
                this.onTransactionCompleted(null);
            }
        }.bind(this), this.onErrorOccured.bind(this));
        select_object.execute();
        var doJoin = function (value1, value2, itemIndex) {
            results[join_index] = {};
            if (value1 === value2[query.column]) {
                results[join_index][query.table] = value2;
                // copy other relative data into current result
                for (var j = 0; j < this._currentQueryStackIndex; j++) {
                    results[join_index][this._queryStack[j].Table] =
                        tmp_results[itemIndex][this._queryStack[j].Table];
                }
                ++join_index;
            }
            else if (query.joinType === 'left') {
                // left join
                results[join_index] = {};
                results[join_index][query.table] = null;
                // copy other relative data into current result
                for (var j = 0; j < this._currentQueryStackIndex; j++) {
                    results[join_index][this._queryStack[j].Table] =
                        tmp_results[itemIndex][this._queryStack[j].Table];
                }
                // results[JoinIndex][joinQuery.Table] = TmpResults[ItemIndex][joinQuery.Table];
                ++join_index;
            }
        }.bind(this);
    };
    Join.prototype.executeRightJoin = function (joinQuery, query) {
        var _this = this;
        var join_results = [], join_index = 0, column = query.column, tmp_results = this._results, result_length = tmp_results.length, item_index = 0, where = {}, onExecutionFinished = function () {
            this._results = join_results;
            // check if further execution needed
            if (this._queryStack.length > this._currentQueryStackIndex + 1) {
                this.startExecutionJoinLogic();
            }
            else {
                this.onTransactionCompleted(null);
            }
        }.bind(this), doRightJoin = function (results) {
            var value_found = false;
            results.forEach(function (item, index) {
                for (item_index = 0; item_index < result_length; item_index++) {
                    if (item[query.column] ===
                        tmp_results[item_index][joinQuery.table][joinQuery.column]) {
                        value_found = true;
                        break;
                    }
                }
                join_results[index] = {};
                join_results[index][query.table] = item;
                if (value_found) {
                    value_found = false;
                    for (var j = 0; j < this._currentQueryStackIndex; j++) {
                        join_results[index][this._queryStack[j].Table] =
                            tmp_results[item_index][this._queryStack[j].Table];
                    }
                }
                else {
                    for (var j = 0; j < this._currentQueryStackIndex; j++) {
                        join_results[index][this._queryStack[j].Table] = null;
                    }
                }
            }, this);
        }.bind(this), executeLogic = function () {
            var select_object = new Select.Instance({
                from: query.table,
                order: query.order,
                where: query.where
            }, function (results) {
                doRightJoin(results);
                onExecutionFinished();
            }, _this.onErrorOccured.bind(_this));
            select_object.execute();
        };
        executeLogic();
    };
    Join.prototype.executeWhereUndefinedLogicForJoin = function (joinQuery, query) {
        var join_results = [], join_index = 0, column = query.column, tmp_results = this._results, 
        // Item,
        result_length = tmp_results.length, item_index = 0, where = {}, onExecutionFinished = function () {
            this._results = join_results;
            // check if further execution needed
            if (this._queryStack.length > this._currentQueryStackIndex + 1) {
                this.startExecutionJoinLogic();
            }
            else {
                this.onTransactionCompleted(null);
            }
        }.bind(this), doJoin = function (results) {
            if (results.length > 0) {
                results.forEach(function (value) {
                    join_results[join_index] = {};
                    join_results[join_index][query.table] = value;
                    // copy other relative data into current result
                    for (var k = 0; k < this._currentQueryStackIndex; k++) {
                        join_results[join_index][this._queryStack[k].Table] =
                            tmp_results[item_index][this._queryStack[k].Table];
                    }
                    ++join_index;
                }, this);
            }
            else if (query.joinType === 'left') {
                // left join
                join_results[join_index] = {};
                join_results[join_index][query.table] = null;
                // copy other relative data into current result
                for (var j = 0; j < this._currentQueryStackIndex; j++) {
                    join_results[join_index][this._queryStack[j].Table] =
                        tmp_results[item_index][this._queryStack[j].Table];
                }
                ++join_index;
            }
        }.bind(this), executeLogic = function () {
            if (item_index < result_length) {
                if (!this._errorOccured) {
                    where[query.column] = tmp_results[item_index][joinQuery.table][joinQuery.column];
                    var select_object = new Select.Instance({
                        from: query.table,
                        order: query.order,
                        where: where
                    }, function (results) {
                        doJoin(results);
                        ++item_index;
                        executeLogic();
                    }, this.onErrorOccured.bind(this));
                    select_object.execute();
                }
            }
            else {
                onExecutionFinished();
            }
        }.bind(this);
        executeLogic();
    };
    Join.prototype.startExecutionJoinLogic = function () {
        var join_query;
        if (this._currentQueryStackIndex >= 1 && this._currentQueryStackIndex % 2 === 1) {
            join_query = {
                column: this._queryStack[this._currentQueryStackIndex].nextJoin.column,
                table: this._queryStack[this._currentQueryStackIndex].nextJoin.table
            };
            this._currentQueryStackIndex++;
        }
        else {
            join_query = this._queryStack[this._currentQueryStackIndex++];
        }
        var query = this._queryStack[this._currentQueryStackIndex];
        if (query.joinType === 'right') {
            this.executeRightJoin(join_query, query);
        }
        else if (query.where) {
            this.executeWhereJoinLogic(join_query, query);
        }
        else {
            this.executeWhereUndefinedLogicForJoin(join_query, query);
        }
    };
    return Join;
}(BaseSelect));
export { Join };
//# sourceMappingURL=join.js.map