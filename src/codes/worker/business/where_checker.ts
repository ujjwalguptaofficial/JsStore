import { Occurence } from "../enums";
import { QueryOption } from "../inner_enums";


/**
 * For matching the different column value existance for where option
 * 
 * @export
 * @class WhereChecker
 */
export class WhereChecker {
  _where: object;
  _status: boolean;

  constructor(where: object) {
    this._where = where;
  }

  check(rowValue) {
    this._status = true;
    var column_value;
    for (var columnName in this._where) {
      if (this._status) {
        column_value = this._where[columnName];
        if (typeof column_value === 'object') {
          for (var key in column_value) {
            if (this._status) {
              switch (key) {
                case QueryOption.In: this.checkIn(columnName, rowValue[columnName]); break;
                case QueryOption.Like: this.checkLike(columnName, rowValue[columnName]); break;
                case QueryOption.Between:
                case QueryOption.Greater_Than:
                case QueryOption.Less_Than:
                case QueryOption.Greater_Than_Equal_To:
                case QueryOption.Less_Than_Equal_To:
                case QueryOption.Not_Equal_To:
                  this.checkComparisionOp(columnName, rowValue[columnName], key);
                  break;
              }
            }
            else {
              break;
            }
          }
        }
        else {
          if (column_value !== rowValue[columnName]) {
            this._status = false;
            break;
          }
        }
      }
      else {
        break;
      }
    }
    return this._status;
  }

  private checkIn(column, value) {
    for (var i = 0, values = this._where[column][QueryOption.In], length = values.length; i < length; i++) {
      if (values[i] === value) {
        this._status = true;
        break;
      }
      else {
        this._status = false;
      }
    }
  }

  private checkLike(column, value) {
    var values = this._where[column][QueryOption.Like].split('%'),
      comp_symbol: Occurence,
      comp_value,
      symbol_index;
    if (values[1]) {
      comp_value = values[1];
      comp_symbol = values.length > 2 ? Occurence.Any : Occurence.Last;
    }
    else {
      comp_value = values[0];
      comp_symbol = Occurence.First;
    }
    value = value.toLowerCase();

    switch (comp_symbol) {
      case Occurence.Any:
        symbol_index = value.indexOf(comp_value.toLowerCase());
        if (symbol_index < 0) {
          this._status = false;
        } break;
      case Occurence.First:
        symbol_index = value.indexOf(comp_value.toLowerCase());
        if (symbol_index > 0 || symbol_index < 0) {
          this._status = false;
        } break;
      default:
        symbol_index = value.lastIndexOf(comp_value.toLowerCase());
        if (symbol_index < value.length - comp_value.length) {
          this._status = false;
        }
    }
  }

  private checkComparisionOp(column, value, symbol) {
    var compare_value = this._where[column][symbol];
    switch (symbol) {
      // greater than
      case QueryOption.Greater_Than: if (value <= compare_value) {
        this._status = false;
      } break;
      // less than
      case QueryOption.Less_Than: if (value >= compare_value) {
        this._status = false;
      } break;
      // less than equal
      case QueryOption.Less_Than_Equal_To: if (value > compare_value) {
        this._status = false;
      } break;
      // greather than equal
      case QueryOption.Greater_Than_Equal_To: if (value < compare_value) {
        this._status = false;
      } break;
      // between
      case QueryOption.Between: if (value < compare_value.Low || value > compare_value.High) {
        this._status = false;
      } break;
      // Not equal to
      case QueryOption.Not_Equal_To: if (value === compare_value) {
        this._status = false;
      } break;
    }
  }
}