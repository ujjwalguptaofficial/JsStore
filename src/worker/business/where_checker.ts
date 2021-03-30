import { OCCURENCE, QUERY_OPTION } from "../../common/index";
import { getRegexFromLikeExpression, getDataType } from "../utils/index";

/**
 * For matching the different column value existance for where option
 * 
 * @export
 * @class WhereChecker
 */
export class WhereChecker {
  where: object;
  checkFlag: boolean;

  constructor(where: object, checkFlag: boolean) {
    this.where = where;
    this.checkFlag = checkFlag;
  }

  check(rowValue) {
    let status = true;
    if (!this.checkFlag) return status;
    for (const columnName in this.where) {
      if (!status) {
        return status;
      }
      const columnValue = this.where[columnName];
      if (getDataType(columnValue) === 'object') {
        for (const key in columnValue) {
          if (!status) {
            return status;
          }
          switch (key) {
            case QUERY_OPTION.In:
              status = this.checkIn(columnName, rowValue[columnName]);
              break;
            case QUERY_OPTION.Like:
              status = this.checkLike_(columnName, rowValue[columnName]);
              break;
            case QUERY_OPTION.Regex:
              status = this.checkRegex(columnName, rowValue[columnName]);
              break;
            case QUERY_OPTION.Between:
            case QUERY_OPTION.GreaterThan:
            case QUERY_OPTION.LessThan:
            case QUERY_OPTION.GreaterThanEqualTo:
            case QUERY_OPTION.LessThanEqualTo:
            case QUERY_OPTION.NotEqualTo:
              status = this.checkComparisionOp_(columnName, rowValue[columnName], key);
              break;
            default:
              status = false;
          }
        }
      }
      else {
        status = columnValue === rowValue[columnName];
      }
    }
    return status;
  }

  private checkIn(column, value) {
    return (this.where[column][QUERY_OPTION.In] as any[]).find(val => val === value) != null;
  }

  private checkLike_(column, value) {
    return getRegexFromLikeExpression(this.where[column][QUERY_OPTION.Like]).test(value);
  }

  private checkRegex(column, value) {
    return this.where[column][QUERY_OPTION.Regex].test(value);
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