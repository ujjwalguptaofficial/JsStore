import { Base } from "./base";

export class WhereBase extends Base {
    protected results: any[] = [];

    protected onQueryFinished() {
        // virtual
    }
}