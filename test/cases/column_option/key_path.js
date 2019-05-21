describe('keyPath test', function () {
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/ false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    if (!(isIE || isEdge)) {
        it('terminate connection', function (done) {
            con.terminate().then(function () {
                console.log('terminated');
                con = new JsStore.Instance();
                done();
            }).catch(function (error) {
                done(error);
            });
        });

        it('create db', function (done) {
            var dbName = 'pinCodeDetails';
            con.isDbExist(dbName).then(function (isExist) {
                if (isExist) {
                    con.openDb(dbName).then(done)
                } else {
                    var db = getDbSchemaOfPinCodes();
                    con.createDb(db).then(function (result) {
                        done();
                    })
                }
            }).catch(function (err) {
                done(err);
            })
        });

        it('bulk insert pinCodes', function (done) {
            var time1 = performance.now();
            $.getJSON("test/static/pinCodes.json", function (results) {
                con.bulkInsert({
                    into: 'pinCodes',
                    values: results,
                }).then(function (results) {
                    console.log('pinCodes inserted');
                    var time2 = performance.now();
                    console.log((time2 - time1) / 1000);
                    expect(results).to.be.an('undefined');
                    done();
                }).
                    catch(function (err) {
                        done(err);
                    });
            });
        })

        it('selecting data based on keyPath', function (done) {
            con.select({
                from: 'pinCodes',
                where: {
                    officetypeAndDeliverystatus: ['B.O', 'Delivery']
                }
            }).then(function (results) {
                expect(results).to.be.an('array').length(4204);
                done();
            }).catch(function (err) {
                done(err);
            })
        })

        it('drop db pincodes', function (done) {
            con.dropDb().then(function () {
                done();
            }).catch(function (err) {
                done(err);
            });
        });
    }
})

function getDbSchemaOfPinCodes() {
    var table = {
        name: 'pinCodes',
        columns: {
            id: {
                primaryKey: true,
                autoIncrement: true
            },
            officename: {
                dataType: 'string'
            }, pincode: {
                dataType: 'string'
            },
            officetype: {
                dataType: 'string'
            }, Deliverystatus: {
                dataType: 'string'
            }, officetypeAndDeliverystatus: {
                keyPath: ['officetype', 'Deliverystatus']
            }, divisionname: {
                dataType: 'string'
            }, regionname: {
                dataType: 'string'
            }, circlename: {
                dataType: 'string'
            }, taluk: {
                dataType: 'string'
            }, districtname: {
                dataType: 'string'
            }, statename: {
                dataType: 'string'
            }
        }
    }
    var database = {
        name: 'pinCodeDetails',
        tables: [table]
    }
    return database;
}