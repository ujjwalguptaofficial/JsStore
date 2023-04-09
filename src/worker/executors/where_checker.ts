import { QUERY_OPTION } from "@/common";
import { getDataType, clone, compare, getRegexFromLikeExpression } from "@worker/utils";

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
    const where = this.where;
    for (let columnName in where) {
      if (!status) {
        return status;
      }
      const whereColumnValue = where[columnName];
      const columnValue = rowValue[columnName];
      const isArrayColumnValue = Array.isArray(columnValue);
      const executeCompare = (executor: Function) => {
        if (isArrayColumnValue) {
          columnValue.every(q => {
            status = executor(q);
            return !status;
          })
        }
        else {
          status = executor(columnValue);
        }
        return
      }

      if (getDataType(whereColumnValue) === "object") {
        for (const key in whereColumnValue) {
          if (!status) {
            return status;
          }
          switch (key) {
            case QUERY_OPTION.In:
              executeCompare((compareValue) => {
                return this.checkIn(whereColumnValue[QUERY_OPTION.In], compareValue);
              })
              break;
            case QUERY_OPTION.Like:
              executeCompare((compareValue) => {
                return this.checkLike_(columnName, compareValue);
              })
              break;
            case QUERY_OPTION.Regex:
              executeCompare((compareValue) => {
                return this.checkRegex(columnName, compareValue);
              })
              break;
            case QUERY_OPTION.Between:
            case QUERY_OPTION.GreaterThan:
            case QUERY_OPTION.LessThan:
            case QUERY_OPTION.GreaterThanEqualTo:
            case QUERY_OPTION.LessThanEqualTo:
            case QUERY_OPTION.NotEqualTo:
              executeCompare((compareValue) => {
                return this.checkComparisionOp_(columnName, compareValue, key);
              })
              break;
            default:
              status = false;
          }
        }
      }
      else {
        executeCompare((storedValue) => {
          return compare(whereColumnValue, storedValue);
        });
      }
    }
    return status;
  }

  private checkIn(whereColumnValue: any[], value) {
    return whereColumnValue.find(q => compare(q, value)) != null;
  }

  private checkLike_(column, value) {
    return getRegexFromLikeExpression(this.where[column][QUERY_OPTION.Like]).test(value);
  }

  private checkRegex(column, value) {
    return this.where[column][QUERY_OPTION.Regex].test(value);
  }

  private checkComparisionOp_(column, value, symbol) {
    const compareValue = this.where[column][symbol];
    if (symbol != QUERY_OPTION.Between) {
      return compare(value, compareValue, symbol);
    }
    return compare(value, compareValue.low, '>=') &&
      compare(value, compareValue.high, '<=');
  }
}