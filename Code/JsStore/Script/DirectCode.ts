(!self.alert)
{
    self.onmessage = function (e) {
        console.log("Request executing from WebWorker, request name:" + e.data.Name);
        var Request = e.data, IndexDbObject = new JsStore.Business.Main();
        IndexDbObject.checkConnectionAndExecuteLogic(Request);
    };
}


