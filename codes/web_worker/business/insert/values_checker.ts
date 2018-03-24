import { Table } from "../../model/table";
import { IError } from "../../interfaces";
import { ValueChecker } from "./value_checker";
import { IdbHelper } from "../../index";
import * as KeyStore from "../../keystore/index";

export class ValuesChecker {
    _table: Table;
    _values: any[];
    _error: IError;
    _onFinish: (isError: boolean) => void;
    _valueCheckerObj: ValueChecker;

    constructor(table: Table, values: any[]) {
        this._table = table;
        this._values = values;
    }

    public checkAndModifyValues(onFinish: (isError: boolean) => void) {
        this._onFinish = onFinish;
        var auto_inc_columns = this._table._columns.filter((col) => {
            return col._autoIncrement;
        });
        var auto_inc_values = {};
        auto_inc_columns.forEach((column) => {
            var auto_increment_key = `JsStore_${IdbHelper._activeDb._name}_${this._table._name}_${column._name}_Value`;
            KeyStore.get(auto_increment_key, (val) => {
                auto_inc_values[column._name] = val;
            });
        });
        KeyStore.get('dumy_key', (val) => {
            this._valueCheckerObj = new ValueChecker(this._table, auto_inc_values);
            this.startChecking();
        }, (err) => {
            this._error = err as any;
            this._onFinish(true);
        });

    }

    private startChecking() {
        var is_error: boolean = false;
        this._values.every(function (item) {
            is_error = this._valueCheckerObj.checkAndModifyValue(item);
            return !is_error;
        }, this);
        if (is_error) {
            this._error = this._valueCheckerObj._error;
            this._onFinish(true);
        }
        else {
            for (var prop in this._valueCheckerObj._autoIncrementValue) {
                var auto_increment_key = `JsStore_${IdbHelper._activeDb._name}_${this._table._name}_${prop}_Value`;
                KeyStore.set(auto_increment_key, this._valueCheckerObj._autoIncrementValue[prop]);
            }
            KeyStore.get('dumy_key', (val) => {
                this._onFinish(false);
            },
                (err) => {
                    this._error = err as any;
                    this._onFinish(true);
                });
        }
    }
}