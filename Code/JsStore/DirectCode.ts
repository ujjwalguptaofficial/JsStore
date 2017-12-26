if (self && !self.alert) {
    self.onmessage = function (e) {
        JsStore.log("Request executing from WebWorker, request name: " + e.data.Name);
        var request = e.data,
            business_main = new JsStore.Business.Main();
        business_main.checkConnectionAndExecuteLogic(request);
    };
    JsStore.worker_status = JsStore.WebWorker_Status.Registered;
    KeyStore.init();
}