export declare class ThenEvaluator {
    private columnName_;
    private value;
    private caseQuery_;
    private caseColumnQuery_;
    private length_;
    setCaseAndValue(caseQuery: any, value: any): void;
    setCaseAndColumn(caseQuery: any, columnName: string): this;
    setColumn(columnName: string): this;
    setValue(value: any): this;
    evaluate(): any;
    private checkCase_;
}
