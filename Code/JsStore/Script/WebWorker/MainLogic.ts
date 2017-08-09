
module JsStore {
    export module WebWorker {
        export class Main {

            public getWorkerUrl = function (onSuccess, onFail) {
                var That = this;
                new Business.AjaxHelper().sendRequest(<Business.IAjaxOption>{
                    Url: this.getScriptUrl(),
                    Type: Business.AjaxReqType.Get,
                    OnError: function (response, status) {
                        if (status != 0) {
                            console.error('unable to load JsStore, error code:' + status + " response is : " + response);
                        }
                        onFail();
                    },
                    OnSuccess: function (response) {
                        if (response.length > 0) {
                            var Url = That.convertStringIntoWorker(response + That.getWorkerEventsinString());
                            onSuccess(Url);
                        }
                        else {
                            onFail();
                        }
                    },
                    PostData: null,
                    ContentType: null
                });
            }

            private getScriptUrl(fileName: string) {
                var ScriptUrl = "";
                var FileName = fileName ? fileName.toLowerCase() : "jsstorage";
                var Scripts = document.getElementsByTagName('script');
                for (var i = Scripts.length - 1; i >= 0; i--) {
                    ScriptUrl = Scripts[i].src.toLowerCase();
                    if (ScriptUrl.length > 0 && ScriptUrl.indexOf(FileName) >= 0) {
                        console.log(ScriptUrl);
                        break;
                    }
                }
                return ScriptUrl;
            }

            public getWorkerEventsinString = function () {
                var WorkerEventsInString = `\n;self.onmessage = function (e) {
                    console.log("WebWorker:"+e.data.Name);
                var Request = e.data, IndexDbObject = new JsStore.Business.Main();
                IndexDbObject.checkConnectionAndExecuteLogic(Request);
                };`;
                return WorkerEventsInString;
            }

            private convertStringIntoWorker = function (string) {
                var BlobStorage = new Blob([string], {
                    type: "text/javascript"
                }), Url = window.URL.createObjectURL(BlobStorage);
                return Url;
            }

        }
    }
}
