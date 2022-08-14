import { Base } from "./base";
import { ISelectQuery, QUERY_OPTION, ERROR_TYPE } from "@/common";
import { getRegexFromLikeExpression, promiseReject } from "@worker/utils";
import { LogHelper, getObjectFirstKey, getDataType, getLength } from "@worker/utils";
import { WhereChecker } from "./where_checker";
import { executeWhereLogic } from "./select/where";
import { executeInLogic } from "./select/in";
import { executeRegexLogic } from "./select/regex";

export class BaseFetch extends Base {
    query: ISelectQuery;
    whereChecker: WhereChecker;
    executeWhereLogic: typeof executeWhereLogic;
    skipRecord;
    limitRecord;
    limitAtEnd = false;
    skipAtEnd = false;
    executeInLogic: typeof executeInLogic;
    executeRegexLogic: typeof executeRegexLogic;

    resultCount: number;

    protected shouldAddValue: (value) => boolean;
    protected goToWhereLogic() {
        const query = this.query as ISelectQuery;
        const whereQuery = query.where;
        let firstColumn = (() => {
            for (const key in whereQuery) {
                if (this.objectStore.indexNames.contains(key)) {
                    return key;
                }
            }
        })();
        if (firstColumn == null) {
            firstColumn = getObjectFirstKey(whereQuery);
            if (!query.store) {
                return promiseReject(
                    new LogHelper(ERROR_TYPE.NoIndexFound, { column: firstColumn })
                );
            }
        }
        const value = whereQuery[firstColumn];
        if (getDataType(value) === 'object') {
            const checkFlag = getLength(value) > 1 ||
                getLength(whereQuery) > 1

            this.whereChecker = new WhereChecker(whereQuery, checkFlag);
            const key = getObjectFirstKey(value);
            this.whereChecker.remove([firstColumn, key]);
            switch (key) {
                case QUERY_OPTION.Like: {
                    const regexVal = getRegexFromLikeExpression(value[QUERY_OPTION.Like]);
                    return this.executeRegexLogic(firstColumn, regexVal);
                }
                case QUERY_OPTION.Regex:
                    return this.executeRegexLogic(firstColumn, value[QUERY_OPTION.Regex]);
                case QUERY_OPTION.In:
                    return this.executeInLogic(
                        firstColumn, value[QUERY_OPTION.In]
                    );
                case QUERY_OPTION.Between:
                case QUERY_OPTION.GreaterThan:
                case QUERY_OPTION.LessThan:
                case QUERY_OPTION.GreaterThanEqualTo:
                case QUERY_OPTION.LessThanEqualTo:
                    return this.executeWhereLogic(firstColumn, value, key, "next");
                case QUERY_OPTION.Aggregate: break;
                default:
                    return this.executeWhereLogic(firstColumn, value, null, "next");
            }
        }
        else {
            const checkFlag = getLength(whereQuery) > 1;
            this.whereChecker = new WhereChecker(whereQuery, checkFlag);
            this.whereChecker.remove([firstColumn]);
            return this.executeWhereLogic(firstColumn, value, null, "next");
        }
    }

}