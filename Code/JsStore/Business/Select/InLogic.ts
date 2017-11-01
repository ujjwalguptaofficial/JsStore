module JsStore {
    export module Business {
        export module Select {
            export class In extends NotWhere {

                private executeSkipAndLimitForIn = function (column, values) {
                    var Cursor: IDBCursorWithValue,
                        Skip = this.SkipRecord,
                        That = this,
                        skipOrPush = function (value) {
                            if (Skip == 0) {
                                That.Results.push(value);
                            }
                            else {
                                --Skip;
                            }
                        };
                    if (That.CheckFlag) {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (That.Results.length != That.LimitRecord && Cursor) {
                                if (That.filterOnOccurence(Cursor.value) &&
                                    That.checkForWhereConditionMatch(Cursor.value)) {
                                    skipOrPush(Cursor.value);
                                }
                                Cursor.continue();
                            }
                        }
                    }
                    else {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (That.Results.length != That.LimitRecord && Cursor) {
                                if (That.filterOnOccurence(Cursor.value)) {
                                    skipOrPush(Cursor.value);
                                }
                                Cursor.continue();
                            }
                        }
                    }
                }

                private executeSkipForIn = function (column, values) {
                    var Cursor: IDBCursorWithValue,
                        Skip = this.SkipRecord,
                        That = this,
                        Index = 0,
                        ValueVisited = {},
                        skipOrPush = function (value) {
                            if (Skip == 0) {
                                That.Results.push(value);
                            }
                            else {
                                --Skip;
                            }
                        };
                    if (That.CheckFlag) {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                var isEqual = function () {
                                    if (Cursor.value[column] == values[Index]) {
                                        ValueVisited[values[Index]] = true;
                                        if (That.checkForWhereConditionMatch(Cursor.value)) {
                                            skipOrPush((Cursor.value));
                                        }
                                        return true;
                                    }
                                    return false;
                                }
                                if (isEqual()) {
                                    Cursor.continue();
                                }
                                else {
                                    if (ValueVisited[values[Index]]) {
                                        ++Index;
                                    }
                                    if (isEqual()) {
                                        Cursor.continue();
                                    }
                                    else {
                                        Cursor.continue(values[Index]);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                var isEqual = function () {
                                    if (Cursor.value[column] == values[Index]) {
                                        ValueVisited[values[Index]] = true;
                                        skipOrPush((Cursor.value));
                                        return true;
                                    }
                                    return false;
                                }
                                if (isEqual()) {
                                    Cursor.continue();
                                }
                                else {
                                    if (ValueVisited[values[Index]]) {
                                        ++Index;
                                    }
                                    if (isEqual()) {
                                        Cursor.continue();
                                    }
                                    else {
                                        Cursor.continue(values[Index]);
                                    }
                                }
                            }
                        }
                    }
                }

                private executeLimitForIn = function (column, values) {
                    var Cursor: IDBCursorWithValue,
                        That = this,
                        Index = 0,
                        ValueVisited = {};

                    if (That.CheckFlag) {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                var isEqual = function () {
                                    if (Cursor.value[column] == values[Index]) {
                                        ValueVisited[values[Index]] = true;
                                        if (That.Results.length != That.LimitRecord &&
                                            That.checkForWhereConditionMatch(Cursor.value)) {
                                            That.Results.push(Cursor.value);
                                        }
                                        return true;
                                    }
                                    return false;
                                }
                                if (isEqual()) {
                                    Cursor.continue();
                                }
                                else {
                                    if (ValueVisited[values[Index]]) {
                                        ++Index;
                                    }
                                    if (isEqual()) {
                                        Cursor.continue();
                                    }
                                    else {
                                        Cursor.continue(values[Index]);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                var isEqual = function () {
                                    if (Cursor.value[column] == values[Index]) {
                                        ValueVisited[values[Index]] = true;
                                        if (That.Results.length != That.LimitRecord) {
                                            That.Results.push(Cursor.value);
                                        }
                                        return true;
                                    }
                                    return false;
                                }
                                if (isEqual()) {
                                    Cursor.continue();
                                }
                                else {
                                    if (ValueVisited[values[Index]]) {
                                        ++Index;
                                    }
                                    if (isEqual()) {
                                        Cursor.continue();
                                    }
                                    else {
                                        Cursor.continue(values[Index]);
                                    }
                                }
                            }
                        }
                    }
                }

                private executeSimpleForIn = function (column, values) {
                    var Cursor: IDBCursorWithValue,
                        That = this,
                        Index = 0,
                        ValueVisited = {};

                    if (That.CheckFlag) {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                var isEqual = function () {
                                    if (Cursor.value[column] == values[Index]) {
                                        ValueVisited[values[Index]] = true;
                                        if (That.checkForWhereConditionMatch(Cursor.value)) {
                                            That.Results.push(Cursor.value);
                                        }
                                        return true;
                                    }
                                    return false;
                                }
                                if (isEqual()) {
                                    Cursor.continue();
                                }
                                else {
                                    if (ValueVisited[values[Index]]) {
                                        ++Index;
                                    }
                                    if (isEqual()) {
                                        Cursor.continue();
                                    }
                                    else {
                                        Cursor.continue(values[Index]);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        this.CursorOpenRequest.onsuccess = function (e) {
                            Cursor = (<any>e).target.result;
                            if (Cursor) {
                                var isEqual = function () {
                                    if (Cursor.value[column] == values[Index]) {
                                        ValueVisited[values[Index]] = true;
                                        That.Results.push(Cursor.value);
                                        return true;
                                    }
                                    return false;
                                }
                                if (isEqual()) {
                                    Cursor.continue();
                                }
                                else {
                                    if (ValueVisited[values[Index]]) {
                                        ++Index;
                                        if (isEqual()) {
                                            Cursor.continue();
                                        }
                                    }
                                    else {
                                        ValueVisited[values[Index]] = true;
                                        Cursor.continue(values[Index]);
                                    }

                                }
                            }
                        }
                    }
                }

                protected executeInLogic = function (column, values) {
                    var That = this;
                    if (typeof values[0] == 'string') {
                        values = this.sortAlphabetInAsc(values);
                    }
                    else if (typeof values[0] == 'number') {
                        values = this.sortNumberInAsc(values);
                    }
                    this.CursorOpenRequest = this.ObjectStore.index(column).openCursor();
                    this.CursorOpenRequest.onerror = function (e) {
                        That.ErrorOccured = true;
                        That.onErrorOccured(e);
                    }
                    if (this.SkipRecord && this.LimitRecord) {
                        this.executeSkipAndLimitForIn(column, values);
                    }
                    else if (this.SkipRecord) {
                        this.executeSkipForIn(column, values);
                    }
                    else if (this.LimitRecord) {
                        this.executeLimitForIn(column, values);
                    }
                    else {
                        this.executeSimpleForIn(column, values);
                    }
                }
            }
        }
    }
}