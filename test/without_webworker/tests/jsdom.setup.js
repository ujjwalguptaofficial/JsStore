const jsdom = require('jsdom');
const chai = require('chai');

const jsdomInstance = new jsdom.JSDOM(`<!DOCTYPE html>
<html lang="en"><body> <div id="app"></div></body></html>`, {
    url: "https://example.org/"
});
global.window = jsdomInstance.window;
global.document = window.document;
global.expect = chai.expect;
window.console = global.console;

Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        global[property] = document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};