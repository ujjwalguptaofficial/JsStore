import { QUERY_OPTION } from "@/common";
import { getDataType, clone, isEqual, getRegexFromLikeExpression } from "@worker/utils";

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
    this.where = clone(where);
    this.checkFlag = checkFlag;
  }

  remove(props: string[]) {
    const last = props.pop();
    const value = props.reduce((prev, curr) => prev && prev[curr], this.where);
    delete value[last];
  }

  check(rowValue) {
    let status = true;
    if (!this.checkFlag) return status;
    for (let columnName in this.where) {
      if (!status) {
        return status;
      }
      const whereColumnValue = this.where[columnName];
      const columnValue = rowValue[columnName];
      if (getDataType(whereColumnValue) === "object") {
        for (const key in whereColumnValue) {
          if (!status) {
            return status;
          }
          switch (key) {
            case QUERY_OPTION.In:
              status = this.checkIn(columnName, columnValue);
              break;
            case QUERY_OPTION.Like:
              status = this.checkLike_(columnName, columnValue);
              break;
            case QUERY_OPTION.Regex:
              status = this.checkRegex(columnName, columnValue);
              break;
            case QUERY_OPTION.Between:
            case QUERY_OPTION.GreaterThan:
            case QUERY_OPTION.LessThan:
            case QUERY_OPTION.GreaterThanEqualTo:
            case QUERY_OPTION.LessThanEqualTo:
            case QUERY_OPTION.NotEqualTo:
              status = this.checkComparisionOp_(columnName, columnValue, key);
              break;
            default:
              status = false;
          }
        }
      }
      else {
        status = isEqual(whereColumnValue, columnValue);
      }
    }
    return status;
  }

  private checkIn(column, value) {
    return (this.where[column][QUERY_OPTION.In] as any[]).find(q => isEqual(q, value)) != null;
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
        return value >= compareValue.low &&
          value <= compareValue.high;
      // Not equal to
      case QUERY_OPTION.NotEqualTo:
        return value !== compareValue;
    }
  }
}