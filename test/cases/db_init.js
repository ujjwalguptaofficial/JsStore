
describe("initiate database", function () {
    before(function () {
        console.log('initiate database');
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        if (isIE) {
            console.log('test runing for ie');
            con = new JsStore.Connection(new Worker('../output/jsstore.worker.ie.min.js'));
        } else {
            if (isRuningForSauce()) {
                console.log("test runing for sauce lab");
                con = new JsStore.Connection(new Worker('../output/jsstore.worker.min.js'));
            } else if (isRuningForProd()) {
                console.log("test runing for production");
                con = new JsStore.Connection(new Worker('../output/jsstore.worker.min.js'));
            } else {
                console.log("test runing for development");
                con = new JsStore.Connection(new Worker('output/jsstore.worker.js'));
                // con.setLogStatus(true);
            }
        }
       
    })

    it("create db exist", function (done) {
        con.logStatus = true;
        con.logStatus = false;
        
        var isFilled = false;
        var isEmpty = false;
        con.on("requestQueueFilled", function () {
            isFilled = true;
        });
        con.on("requestQueueEmpty", function () {
            isEmpty = true;
        });
        con.on("open", (db) => {
            expect(db.version).equal(1);
            expect(db.name).equal("Demo");
        })
        con.on("create", (db) => {
            expect(db.version).equal(1);
            expect(db.name).equal("Demo");
        })
        var isUpgradeCalled = false;
        con.on("upgrade", (db) => {
            isUpgradeCalled = true;
        })
        con.initDb(getDemoDbSchema()).then(function (isDbCreated) {
            console.log('Database created', isDbCreated);
            expect(isDbCreated).to.be.an('boolean').equal(true);
            expect(isFilled).to.be.an('boolean').equal(true);
            setTimeout(function () {
                expect(isEmpty).to.be.an('boolean').equal(true);
                expect(isUpgradeCalled).to.be.an('boolean').equal(false);
                expect(con.requestQueue_.length).to.be.equal(0);
                con.off("open");
                con.off("create");
                con.off("upgrade");
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

