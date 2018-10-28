describe('keyPath test', function () {
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/ false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    if (!isIE || !isEdge) {
        it('terminate connection', function (done) {
            Con.terminate().then(function () {
                Con = new JsStore.Instance();
                done();
            }).catch(function (error) {
                done(error);
            });
        });

        it('create db', function (done) {
            var dbName = 'pinCodeDetails';
            Con.isDbExist(dbName).then(isExist => {
                if (isExist) {
                    Con.openDb(dbName).then(done)
                } else {
                    var db = getDbSchemaOfPinCodes();
                    Con.createDb(db).then(function (result) {
                        done();
                    })
                }
            }).catch(err => {
                done(err);
            })
        });

        it('bulk insert pinCodes', function (done) {
            var time1 = performance.now();
            $.getJSON("test/static/pinCodes.json", function (results) {
                Con.bulkInsert({
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
            Con.select({
                from: 'pinCodes',
                where: {
                    officetypeAndDeliverystatus: ['B.O', 'Delivery']
                }
            }).then(function (results) {
                expect(results).to.be.an('array').length(4204);
                done();
            }).catch(err => {
                done(err);
            })
        })
    }
})

function getDbSchemaOfPinCodes() {
    var table = {
        name: 'pinCodes',
        columns: [{
                name: 'id',
                primaryKey: true,
                autoIncrement: true
            },
            {
                name: 'officename',
                dataType: 'string'
            }, {
                name: 'pincode',
                dataType: 'string'
            },
            {
                name: 'officetype',
                dataType: 'string'
            }, {
                name: 'Deliverystatus',
                dataType: 'string'
            }, {
                name: 'officetypeAndDeliverystatus',
                keyPath: ['officetype', 'Deliverystatus']
            }, {
                name: 'divisionname',
                dataType: 'string'
            }, {
                name: 'regionname',
                dataType: 'string'
            }, {
                name: 'circlename',
                dataType: 'string'
            }, {
                name: 'taluk',
                dataType: 'string'
            }, {
                name: 'districtname',
                dataType: 'string'
            }, {
                name: 'statename',
                dataType: 'string'
            }
        ]
    }
    var database = {
        name: 'pinCodeDetails',
        tables: [table]
    }
    return database;
}