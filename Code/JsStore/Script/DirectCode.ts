if (!self.alert) {
    self.onmessage = function (e) {
        if (JsStore.EnableLog) {
            console.log("Request executing from WebWorker, request name: " + e.data.Name);
        }
        var Request = e.data,
        IndexDbObject = new JsStore.Business.Main();
        IndexDbObject.checkConnectionAndExecuteLogic(Request);
    };
    JsStore.WorkerStatus = JsStore.WebWorkerStatus.Registered;
    KeyStore.init();
}

