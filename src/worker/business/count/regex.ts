import { Like } from "./like";

export class LikeRegex extends Like {
    protected executeRegexLogic(column:string, exp:RegExp) {
        this.passFilter = ( colValue: string ) => exp.test( colValue );
        this.passAction = ( _cursor: IDBCursor ) => { ++this.resultCount; }
        this.executeWhereOnColumn(column);
    }
}