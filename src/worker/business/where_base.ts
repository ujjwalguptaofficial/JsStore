import { Base } from "./base";

export class WhereBase extends Base {
    protected results : any[] = [] ;
    protected skipCnt : number ;
    protected passFilter: ( value: any ) => boolean ;
    protected passAction: ( value: any ) => void ;

    protected executeWhereOnColumn( column ) {
        this.skipCnt = this.skipRecord;
        this.cursorOpenRequest = this.objectStore.index(column).openCursor();
        this.cursorOpenRequest.onerror = this.onCursorError;
        this.cursorOpenRequest.onsuccess = (e: any) => {
            const cursor = e.target.result;
            if (cursor && this.didNotReachLimit( )) {
                if (this.pass(cursor)) {
                    this.passAction(cursor.value);
                }
                cursor.continue();
            } else {
                this.onQueryFinished();
            }
        };
    }

    protected didNotReachLimit ( )
    {
      return !this.limitRecord || this.results.length < this.limitRecord ;
    }

    protected pass ( cursor: IDBCursorWithValue )
    {
      return this.passFilter(cursor.key) &&
             (!this.checkFlag || this.whereCheckerInstance.check(cursor.value)) ;
    }

    protected skipOrPush = (value) => {
        if ( !this.skipRecord || this.skipCnt === 0) {
            this.results.push(value);
        }
        else {
            --this.skipCnt;
        }
    }

    protected onQueryFinished() {
        // virtual
    }
}