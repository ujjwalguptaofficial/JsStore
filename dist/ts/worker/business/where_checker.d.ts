/**
 * For matching the different column value existance for where option
 *
 * @export
 * @class WhereChecker
 */
export declare class WhereChecker {
    where: object;
    status: boolean;
    checkFlag: boolean;
    constructor(where: object, checkFlag: boolean);
    check(rowValue: any): boolean;
    private checkIn;
    private checkLike;
    private checkRegex;
    private checkComparisionOp;
}
