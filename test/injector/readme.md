# Introduction

This is an example of using jsstore without web worker in typescript. This is achieved by providing no parameter to jsstore instance.

e.g -  
// using web worker

var jsstoreCon = new JsStore.Instance(new Worker('path of worker));

// using without web worker

var jsstoreCon = new JsStore.Instance();

Note : - make sure you have included jsstore.worker file in your app.

# How to run

1. execute `npm install` - install all dependecies
2. execute `npm run start` - run the dev server
3. browse url - `http://localhost:8080/`