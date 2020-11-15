import { OCCURENCE, QUERY_OPTION } from "../../common/index";
import { getRegexFromLikeExpression } from "../utils/index";

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
                this.status = this.checkIn(columnName, rowValue[columnName]); break;
              case QUERY_OPTION.Like:
                this.status = this.checkLike_(columnName, rowValue[columnName]); break;
              case QUERY_OPTION.Regex:
                this.checkRegex(columnName, rowValue[columnName]); break;
              case QUERY_OPTION.Between:
              case QUERY_OPTION.GreaterThan:
              case QUERY_OPTION.LessThan:
              case QUERY_OPTION.GreaterThanEqualTo:
              case QUERY_OPTION.LessThanEqualTo:
              case QUERY_OPTION.NotEqualTo:
                this.status = this.checkComparisionOp_(columnName, rowValue[columnName], key);
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
    return (this.where[column][QUERY_OPTION.In] as any[]).find(val => val === value) != null;
  }

  private checkLike_(column, value) {
    return getRegexFromLikeExpression(this.where[column][QUERY_OPTION.Like]).test(value);
  }

  private checkRegex(column, value) {
    const expr = this.where[column][QUERY_OPTION.Regex];
    this.status = expr.test(value);
  }

  private checkComparisionOp_(column, value, symbol) {
    const compareValue = this.where[column][symbol];
    switch (symbol) {
      // greater than
      case QUERY_OPTION.GreaterThan:
        return value > compareValue;
      // less than
      case QUERY_OPTION.LessThan:
        return value < compareValue;
      // less than equal
      case QUERY_OPTION.LessThanEqualTo:
        return value <= compareValue;
      // greather than equal
      case QUERY_OPTION.GreaterThanEqualTo:
        return value >= compareValue;
      // between
      case QUERY_OPTION.Between:
        return value > compareValue.low && value < compareValue.high;
      // Not equal to
      case QUERY_OPTION.NotEqualTo:
        return value !== compareValue;
    }
  }
}