# Introduction

This is an example of jsstore without using web worker. THis is achieved by providing no parameter to jsstore instance.

e.g -  
//using web worker

var jsstoreCon = new JsStore.Instance(new Worker('path of worker));

// using without web worker

var jsstoreCon = new JsStore.Instance();

Note : - make sure you have included jsstore.worker file in your app.
