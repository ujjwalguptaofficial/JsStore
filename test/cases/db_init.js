
describe("initiate database", function () {
    before(function () {
        console.log('initiate database');
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        if (isIE) {
            console.log('test runing for ie');
            con = new JsStore.Instance(new Worker('../output/jsstore.worker.ie.min.js'));
        } else {
            if (isRuningForSauce()) {
                console.log("test runing for sauce lab");
                con = new JsStore.Instance(new Worker('../output/jsstore.worker.min.js'));
            } else if (isRuningForProd()) {
                console.log("test runing for production");
                con = new JsStore.Instance(new Worker('../output/jsstore.worker.min.js'));
            } else {
                console.log("test runing for development");
                con = new JsStore.Instance(new Worker('output/jsstore.worker.js'));
                // con.setLogStatus(true);
            }
        }
        // con.setLogStatus(true);
    })

    it("create db exist", function (done) {
        // con.isDbExist('Demo').then(function (exist) {
        //     console.log('db exist :' + exist);
        //     if (exist) {
        //         con.openDb('Demo').then(done);
        //     } else {

        //     }
        // }).catch(function (err) {
        //     done(err);
        // });
        var isFilled = false;
        var isEmpty = false;
        con.on("requestQueueFilled", function () {
            isFilled = true;
        });
        con.on("requestQueueEmpty", function () {
            isEmpty = true;
        });
        con.initDb(getDemoDbSchema()).then(function (isDbCreated) {
            console.log('Database created', isDbCreated);
            expect(isDbCreated).to.be.an('boolean').equal(true);
            expect(isFilled).to.be.an('boolean').equal(true);
            setTimeout(function () {
                expect(isEmpty).to.be.an('boolean').equal(true);
                expect(con.requestQueue_.length).to.be.equal(0);
                done();
            }, 2000);
        });
    })

    it('off event', function (done) {
        con.off("requestQueueFilled");
        var indexes = con.requestQueue_.map(function (ev, i) {
            if (ev.event === event) {
                return i;
            }
        });
        if (indexes.length > 0) {
            done('event is not removed');
        }
        else {
            done('');
        }
    })
})

