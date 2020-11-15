import { OCCURENCE, QUERY_OPTION } from "../../common/index";

/**
 * For matching the different column value existance for where option
 * 
 * @export
 * @class WhereChecker
 */
export class WhereChecker {
  where: object;
  status: boolean;
  checkFlag: boolean;

  constructor(where: object, checkFlag: boolean) {
    this.where = where;
    this.checkFlag = checkFlag;
  }

  check(rowValue) {
    this.status = true;
    if (this.checkFlag === true) {
      for (const columnName in this.where) {
        if (!this.status) {
          break;
        }
        const columnValue = this.where[columnName];
        if (typeof columnValue === 'object') {
          for (const key in columnValue) {
            if (!this.status) {
              break;
            }
            switch (key) {
              case QUERY_OPTION.In:
                this.checkIn(columnName, rowValue[columnName]); break;
              case QUERY_OPTION.Like:
                this.checkLike(columnName, rowValue[columnName]); break;
              case QUERY_OPTION.Regex:
                this.checkRegex(columnName, rowValue[columnName]); break;
              case QUERY_OPTION.Between:
              case QUERY_OPTION.GreaterThan:
              case QUERY_OPTION.LessThan:
              case QUERY_OPTION.GreaterThanEqualTo:
              case QUERY_OPTION.LessThanEqualTo:
              case QUERY_OPTION.NotEqualTo:
                this.checkComparisionOp(columnName, rowValue[columnName], key);
                break;
            }
          }
        }
        else {
          this.status = columnValue === rowValue[columnName];
        }
      }
    }
    return this.status;
  }

  private checkIn(column, value) {
    for (let i = 0, values = this.where[column][QUERY_OPTION.In], length = values.length; i < length; i++) {
      if (values[i] === value) {
        this.status = true;
        break;
      }
      else {
        this.status = false;
      }
    }
  }

  private checkLike(column, value) {
    const values = this.where[column][QUERY_OPTION.Like].split('%');
    let compSymbol: OCCURENCE,
      compValue,
      symbolIndex;
    if (values[1]) {
      compValue = values[1];
      compSymbol = values.length > 2 ? OCCURENCE.Any : OCCURENCE.Last;
    }
    else {
      compValue = values[0];
      compSymbol = OCCURENCE.First;
    }
    value = value.toLowerCase();

    switch (compSymbol) {
      case OCCURENCE.Any:
        symbolIndex = value.indexOf(compValue.toLowerCase());
        if (symbolIndex < 0) {
          this.status = false;
        } break;
      case OCCURENCE.First:
        symbolIndex = value.indexOf(compValue.toLowerCase());
        if (symbolIndex > 0 || symbolIndex < 0) {
          this.status = false;
        } break;
      default:
        symbolIndex = value.lastIndexOf(compValue.toLowerCase());
        if (symbolIndex < value.length - compValue.length) {
          this.status = false;
        }
    }
  }

  private checkRegex(column, value) {
    const expr = this.where[column][QUERY_OPTION.Regex];

    this.status = expr.test(value);
  }

  private checkComparisionOp(column, value, symbol) {
    const compareValue = this.where[column][symbol];
    switch (symbol) {
      // greater than
      case QUERY_OPTION.GreaterThan: if (value <= compareValue) {
        this.status = false;
      } break;
      // less than
      case QUERY_OPTION.LessThan: if (value >= compareValue) {
        this.status = false;
      } break;
      // less than equal
      case QUERY_OPTION.LessThanEqualTo: if (value > compareValue) {
        this.status = false;
      } break;
      // greather than equal
      case QUERY_OPTION.GreaterThanEqualTo: if (value < compareValue) {
        this.status = false;
      } break;
      // between
      case QUERY_OPTION.Between: if (value < compareValue.low || value > compareValue.high) {
        this.status = false;
      } break;
      // Not equal to
      case QUERY_OPTION.NotEqualTo: if (value === compareValue) {
        this.status = false;
      } break;
    }
  }
}