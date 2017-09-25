module JsStore {
    export var EnableLog = false,
        DbVersion: number = 0,
        Status: JsStoreStatus = <JsStoreStatus>{
            ConStatus: ConnectionStatus.NotStarted,
            LastError: ""
        },
        TempResults: Array<any> = [];

    export var throwError = function (error) {
        throw error;
    }

    export var getObjectFirstKey = function (value) {
        for (var key in value) {
            return key;
        }
        return null;
    }
}