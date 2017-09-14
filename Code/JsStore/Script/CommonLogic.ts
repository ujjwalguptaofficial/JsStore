module JsStore {
    export var EnableLog = false,
        DbVersion: number = 0,
        Status: JsStoreStatus = <JsStoreStatus>{
            ConStatus: ConnectionStatus.NotStarted,
            LastError: ""
        }

    export var throwError = function (error) {
        throw error;
    }
}