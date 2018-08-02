/**
 * For matching the different column value existance for where option
 *
 * @export
 * @class WhereChecker
 */
export declare class WhereChecker {
    where: object;
    status: boolean;
    constructor(where: object);
    check(rowValue: any): boolean;
    private checkIn(column, value);
    private checkLike(column, value);
    private checkComparisionOp(column, value, symbol);
}
