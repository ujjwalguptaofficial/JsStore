describe('keyPath test', function () {
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/ false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    if (!(isIE || isEdge)) {
        it('terminate connection', function (done) {
            con.terminate().then(function () {
                console.log('terminated');
                con = new JsStore.Connection();
                done();
            }).catch(function (error) {
                done(error);
            });
        });

        it('create db', function (done) {
            var db = getDbSchemaOfPinCodes();
            con.initDb(db).then(function (isDbCreated) {
                expect(isDbCreated).to.be.an('boolean').equal(true);
                done();
            })
        });

        it('bulk insert pinCodes', function (done) {
            var time1 = performance.now();
            $.getJSON("test/static/pinCodes.json", function (results) {
                con.insert({
                    into: 'pinCodes',
                    values: results,
                    skipDataCheck: true
                }).then(function (results) {
                    console.log('pinCodes inserted');
                    var time2 = performance.now();
                    console.log((time2 - time1) / 1000);
                    expect(results).to.be.an('number').to.equal(5000);
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


        it('insert metingen', function (done) {

            con.insert({
                into: 'metingen',
                values: metingenValues
            }).then(function (results) {
                expect(results).to.be.an('number').to.equal(1);
                done();
            }).
                catch(function (err) {
                    done(err);
                });
        })

        it('check metingen unique', function (done) {

            con.insert({
                into: 'metingen',
                values: metingenValues
            }).then(function (results) {
                expect(results).to.be.an('number').to.equal(1);
                done();
            }).catch(function (err) {
                var error = { "message": "Key already exists in the object store.", "type": "ConstraintError" };
                expect(err).to.be.an('object').to.haveOwnProperty('type').equal('ConstraintError')
                done();
            });
        })

        it('insert metingen v2', function (done) {
            con.insert({
                into: 'metingenV2',
                values: metingenV2Values
            }).then(function (results) {
                expect(results).to.be.an('number').to.equal(1);
                done();
            }).
                catch(function (err) {
                    done(err);
                });
        })

        it('check metingenv2 unique', function (done) {
            con.insert({
                into: 'metingen',
                values: metingenValues
            }).then(function (results) {
                expect(results).to.be.an('number').to.equal(1);
                done();
            }).catch(function (err) {
                var error = { "message": "Key already exists in the object store.", "type": "ConstraintError" };
                expect(err).to.be.an('object').to.haveOwnProperty('type').equal('ConstraintError')
                done();
            });
        });

        it('select all value from metigenv2', function (done) {
            con.select({
                from: 'metingenV2'
            }).then(function (results) {
                expect(results).to.be.an('array').length(1);
                done();
            }).catch(function (err) {
                done(err);
            });
        });

        it('select all value from metigenv2 with where keypath', function (done) {
            const value = metingenV2Values[0];
            con.select({
                from: 'metingenV2',
                where: {
                    unique: [value.userID, value.date, value.time]
                }
            }).then(function (results) {
                expect(results).to.be.an('array').length(1);
                done();
            }).catch(function (err) {
                done(err);
            });
        });

        it('drop db pincodes', function (done) {
            con.dropDb().then(function () {
                done();
            }).catch(function (err) {
                done(err);
            });
        });
    }

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
        var metingen = {
            name: 'metingen',
            columns: {
                id: { primaryKey: true, autoIncrement: true },
                userID: { notNull: true, dataType: 'number' },
                date: { notNull: true, dataType: 'string' },
                time: { notNull: true, dataType: 'string' },
                unique: {
                    keyPath: ['userID', 'date', 'time'],
                    unique: true
                }
            },
            alter: {

            }
        };
        // for testing keypath and primary key together
        var metingenV2 = {
            name: 'metingenV2',
            columns: {
                id: { autoIncrement: true },
                userID: { notNull: true, dataType: 'number' },
                date: { notNull: true, dataType: 'string' },
                time: { notNull: true, dataType: 'string' },
                unique: {
                    keyPath: ['userID', 'date', 'time'],
                    // unique: true,
                    primaryKey: true,
                }
            },
            alter: {

            }
        };
        var database = {
            name: 'pinCodeDetails',
            tables: [table, metingen, metingenV2]
        }
        return database;
    }

    var metingenValues = [{
        userID: 1,
        date: new Date().toString(),
        time: new Date().getTime().toString()
    }];
    var metingenV2Values = [{
        userID: 1,
        date: new Date().toString(),
        time: new Date().getTime().toString()
    }];
})

