module JsStore {
    export module Business {
        export class BaseSelectLogic extends BaseLogic {
            Results = [];
            SendResultFlag: Boolean = true;

            protected getKeyRange = function (whereIn: IWhereIn) {
                var KeyRange: IDBKeyRange;
                switch (this.Query.WhereIn.Op) {
                    case '-': KeyRange = IDBKeyRange.bound(whereIn.Start, whereIn.End); break;
                    case '>': KeyRange = IDBKeyRange.lowerBound(whereIn.Value, true); break;
                    case '>=': KeyRange = IDBKeyRange.lowerBound(whereIn.Value); break;
                    case '<': KeyRange = IDBKeyRange.upperBound(whereIn.Value, true); break;
                    case '<=': KeyRange = IDBKeyRange.upperBound(whereIn.Value); break;
                    default: this.ErrorOccured = true; UtilityLogic.getError(ErrorType.InvalidOp, true, { Op: whereIn.Op });
                }
                return KeyRange;

            }


            /**
             * For matching the different column value existance
             * 
             * @private
             * @param {any} where 
             * @param {any} value 
             * @returns 
             * 
             * @memberOf SelectLogic
             */
            protected checkForWhereConditionMatch(where, value) {
                var TempColumn;
                for (TempColumn in where) {
                    if (Array.isArray(where[TempColumn])) {
                        var i, Status = true;
                        for (i = 0; i < TempColumn.length; i++) {
                            if (where[TempColumn][i] == value[TempColumn]) {
                                Status = true;
                                break;
                            }
                            else {
                                Status = false;
                            }
                        };
                        if (!Status) {
                            return Status;
                        }
                    }
                    else {
                        if (where[TempColumn] != value[TempColumn]) {
                            return false;
                        }
                    }
                }
                return true;
            }
        }
    }
}
