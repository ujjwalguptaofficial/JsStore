namespace JsStore {
  export namespace Business {
    /**
     * For matching the different column value existance for where option
     * 
     * @export
     * @class WhereChecker
     */
    export class WhereChecker {
      _where;
      _status;

      constructor(where) {
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
                    case 'In': this.checkIn(columnName, rowValue[columnName]); break;
                    case 'Like': this.checkLike(columnName, rowValue[columnName]); break;
                    case '-':
                    case '>':
                    case '<':
                    case '>=':
                    case '<=':
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
        for (var i = 0, values = this._where[column].In, length = values.length; i < length; i++) {
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
        var values = this._where[column].Like.split('%'),
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
          case '>': if (value <= compare_value) {
            this._status = false;
          } break;
          // less than
          case '<': if (value >= compare_value) {
            this._status = false;
          } break;
          // less than equal
          case '<=': if (value > compare_value) {
            this._status = false;
          } break;
          // greather than equal
          case '>=': if (value < compare_value) {
            this._status = false;
          } break;
          // between
          case '-': if (value < compare_value.Low || value > compare_value.High) {
            this._status = false;
          } break;
        }
      }
    }
  }
}
