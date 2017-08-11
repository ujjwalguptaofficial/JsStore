(!self.alert)
{
    self.onmessage = function (e) {
        console.log("WebWorker:" + e.data.Name);
        var Request = e.data, IndexDbObject = new JsStore.Business.Main();
        IndexDbObject.checkConnectionAndExecuteLogic(Request);
    };
}


