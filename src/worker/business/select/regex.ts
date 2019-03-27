import { Like } from "./like";

export class LikeRegex extends Like {
    protected executeRegexLogic(column, exp: RegExp) {
        this.passFilter = ( colValue: string ) => exp.test( colValue );
        this.passAction = this.skipOrPush;
        this.executeWhereOnColumn(column);
    }
}