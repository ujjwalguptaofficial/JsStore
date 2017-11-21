if (self && !self.alert) {
    self.onmessage = function (e) {
        JsStore.log("Request executing from WebWorker, request name: " + e.data.Name);
        var Request = e.data,
            BusinessMain = new JsStore.Business.Main();
        BusinessMain.checkConnectionAndExecuteLogic(Request);
    };
    JsStore.WorkerStatus = JsStore.WebWorkerStatus.Registered;
    KeyStore.init();
}

