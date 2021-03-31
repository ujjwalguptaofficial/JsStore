/**
 * For matching the different column value existance for where option
 *
 * @export
 * @class WhereChecker
 */
export declare class WhereChecker {
    where: object;
    checkFlag: boolean;
    constructor(where: object, checkFlag: boolean);
    remove(props: string[]): void;
    check(rowValue: any): boolean;
    private checkIn;
    private checkLike_;
    private checkRegex;
    private checkComparisionOp_;
}
