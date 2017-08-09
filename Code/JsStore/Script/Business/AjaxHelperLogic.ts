module JsStore {
    export module Business {
        export enum AjaxReqType {
            Get = "GET",
            Post = "POST"
        }
        export interface IAjaxOption {
            Url: string,
            OnSuccess: Function,
            OnError: Function,
            PostData: any,
            ContentType: string,
            Type: AjaxReqType
        }
        export class AjaxHelper {
            XMLHttpFactories = [
                function () { return new XMLHttpRequest() },
                function () { return new ActiveXObject("Msxml3.XMLHTTP") },
                function () { return new ActiveXObject("Msxml2.XMLHTTP.6.0") },
                function () { return new ActiveXObject("Msxml2.XMLHTTP.3.0") },
                function () { return new ActiveXObject("Msxml2.XMLHTTP") },
                function () { return new ActiveXObject("Microsoft.XMLHTTP") }
            ];

            sendRequest = function (option: IAjaxOption) {
                var Req = this.createXMLHTTPObject();
                if (!Req) return;
                Req.open(option.Type, option.Url, true);

                if (option.Type == AjaxReqType.Post) {
                    var ContentType = option.ContentType ? option.ContentType : 'application/x-www-form-urlencoded';
                    Req.setRequestHeader('Content-type', ContentType);
                }
                Req.onreadystatechange = function () {
                    if (Req.readyState != 4) return;
                    if (Req.status != 200 && Req.status != 304) {
                        if (option.OnError) {
                            option.OnError(Req.responseText, Req.status);
                        }
                    }
                    else {
                        if (option.OnSuccess) {
                            option.OnSuccess(Req.responseText, Req.status);
                        }
                    }
                }
                if (Req.readyState == 4) return;
                Req.send(option.PostData);
            }

            private createXMLHTTPObject = function () {
                var xmlhttp = false;
                for (var i = 0; i < this.XMLHttpFactories.length; i++) {
                    try {
                        xmlhttp = this.XMLHttpFactories[i]();
                    }
                    catch (e) {
                        continue;
                    }
                    break;
                }
                return xmlhttp;
            }
        }
    }
}
