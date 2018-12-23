window.__karma__.loaded = function () {};
window.onload = function () {
    startTest();
}

function startTest() {
    window.__karma__.start();
}

function onDbInit() {
    console.log('mocha test starting');
    // mocha.setup({
    //     timeout: 5000
    // });
    // runTestForSelect();
    window.__karma__.start();
    // ShouldStartTest = true;
    //  mocha.run();
    // var Root = "cases",
    //     Files = ["select.js"];
    // Files.forEach(function (value) {
    //     var Url = Root + "/" + value;
    //     console.log('test runing for: ' + value);
    //     var Script = document.createElement('script');
    //     Script.setAttribute('src', Url);
    //     document.head.appendChild(Script);
    // })
    // runTestForSelect();
    // mocha.run();
}

// var ShouldStartTest = false,
//     startTesting = function () {
//         console.log('start testing called');
//         if (ShouldStartTest) {
//             // window.__karma__.start();
//             runTestForSelect();
//             window.__karma__.start();
//             // mocha.run();

//         } else {
//             setTimeout(() => {
//                 startTesting();
//             }, 10000);
//         }
//     }
// startTesting();