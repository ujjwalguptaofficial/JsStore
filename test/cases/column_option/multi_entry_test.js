describe('Multi Entry Test', function () {
    it('terminate connection', function (done) {
        con.terminate().then(function () {
            con = new JsStore.Instance();
            done();
        }).catch(function (error) {
            done(error);
        });
    });

    it('create db with promise', function (done) {
        con.initDb(MultiEntryTest.getDbSchema()).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(true);
            console.log('Database created');
            done();
        });
    });

    it('insert data into table', function (done) {
        con.insert({
            into: 'people',
            values: MultiEntryTest.getValues()
        }).
            then(function (results) {
                expect(results).to.be.an('number').equal(3);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('push an item into array', function (done) {
        con.update({
            in: 'people',
            where: {
                name: "Marc",
            },
            set: {
                tags: {
                    '{push}': 'JsStore'
                }
            },
        }).then(function (results) {
            expect(results).to.be.an('number').equal(1);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select items after pushing', function (done) {
        con.select({
            from: 'people',
            where: {
                name: "Marc",
            }
        }).then(function (results) {
            const tags = results[0].tags;
            expect(tags).to.be.an('array').length(3).eql(["mongo", "jenkins", 'JsStore'])
            done();
        }).catch(function (err) {
            done(err);
        })
    });


    it('multientry test without multientry column - select data from array', function (done) {
        con.select({
            from: 'people',
            where: {
                tags: 'mongo'
            }
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(0);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('change db with multientry column', function (done) {
        con.isDbExist({
            dbName: 'MultiEntryTest',
            table: {
                name: 'person',
                version: 2
            }
        }).then(function (isExist) {
            expect(isExist).to.be.an('boolean').equal(false);
            var db = MultiEntryTest.getDbSchema();
            db.tables[0].version = 2;
            db.tables[0].columns[Object.keys(db.tables[0].columns)[1]].multiEntry = true;
            con.initDb(db).then(function (isDbCreated) {
                expect(isDbCreated).to.be.an('boolean').equal(true);
                done();
            })
        }).catch(function (err) {
            done(err);
        });
    });

    it('insert data into table multiEntryTest', function (done) {
        var values = MultiEntryTest.getValues();
        //console.log(values);
        con.insert({
            into: 'people',
            values: values
        }).
            then(function (results) {
                expect(results).to.be.an('number').equal(3);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('multientry test with multientry column - select data from array', function (done) {
        con.select({
            from: 'people',
            where: {
                tags: 'mongo'
            }
        }).
            then(function (results) {
                // Internet Explorer 6-11
                var isIE = /*@cc_on!@*/ false || !!document.documentMode;

                // Edge 20+
                var isEdge = !isIE && !!window.StyleMedia;
                if (results.length == 0 && (isIE || isEdge)) {
                    console.log('Bypassing multi entry test in ie');
                } else {
                    expect(results).to.be.an('array').length(1);
                }
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('unique column test for insert', function (done) {
        var value = {
            name: "Ray",
            tags: ["apple", "banana", "beer"]
        };
        con.insert({
            into: 'people',
            values: [value]
        }).then(function (err) {
            done(err);
        }).catch(function (err) {
            var error = {
                "message": "Unable to add key to index 'name': at least one key does not satisfy the uniqueness requirements.",
                "type": "ConstraintError"
            }
            expect(err.type).to.be.an('string').eql(error.type);
            done();
        })

    });

    it('unique column test for update', function (done) {
        con.update({
            in: 'people',
            set: {
                name: 'Ray'
            }
        }).catch(function (err) {
            var error = {
                "message": "Unable to add key to index 'name': at least one key does not satisfy the uniqueness requirements.",
                "type": "ConstraintError"
            }
            expect(err.type).to.be.an('string').eql(error.type);
            done();
        })

    });

    it('unique column test for update with where', function (done) {
        con.update({
            in: 'people',
            set: {
                name: 'Ray'
            },
            where: {
                name: 'Scott'
            },
        }).catch(function (err) {
            var error = {
                "message": "Unable to add key to index 'name': at least one key does not satisfy the uniqueness requirements.",
                "type": "ConstraintError"
            }
            expect(err.type).to.be.an('string').eql(error.type);
            done();
        })

    });

    it('array data type check', function (done) {
        var value = {
            name: "Ray",
            tags: "apple"
        };
        con.insert({
            into: 'people',
            values: [value]
        }).
            catch(function (err) {
                var error = {
                    "message": "Supplied value for column 'tags' have wrong data type",
                    "type": "wrong_data_type"
                };
                expect(err).to.be.an('object').eql(error);
                done();
            })
    });

    it('Array column update to empty value', function (done) {
        con.update({
            in: 'people',
            where: {
                name: 'Scott'
            },
            set: {
                tags: []
            }
        }).then(function (rowsUpdated) {
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('check array column is updated to empty', function (done) {
        con.select({
            from: 'people',
            where: {
                name: 'Scott'
            }
        }).
            then(function (results) {
                var result = results[0];
                expect(results).to.be.an('array').length(1);
                // if (window.navigator.userAgent.indexOf("Mac") && GetBrowserName().toLowerCase() == 'firefox') {
                //     console.log('bypassing test');
                // } else {
                //     expect(result['tags']).to.be.an('array').eql([]);
                // }
                expect(result['tags']).to.be.an('array').eql([]);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    })

    it('Array column update to null value', function (done) {
        con.update({
            in: 'people',
            where: {
                name: 'Scott'
            },
            set: {
                tags: null
            }
        }).then(function (rowsUpdated) {
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('check if data has been updated to null', function (done) {
        con.select({
            from: 'people',
            where: {
                name: 'Scott'
            }
        }).then(function (results) {
            var result = results[0];
            expect(results).to.be.an('array').length(1);
            expect(result['tags']).to.be.an('null');
            done();
        }).catch(function (err) {
            done(err);
        })
    })
});

var MultiEntryTest = {
    getDbSchema: function () {
        var people = {
            name: 'people',
            columns: {
                name: {
                    unique: true,
                    dataType: JsStore.DATA_TYPE.String
                },
                tags: {
                    dataType: JsStore.DATA_TYPE.Array
                }
            }
        },
            dataBase = {
                name: 'MultiEntryTest',
                tables: [people]
            };
        return dataBase;
    },
    getValues: function () {
        var values = [{
            name: "Ray",
            tags: ["apple", "banana", "beer"]
        },
        {
            name: "Scott",
            tags: ["beer"]
        }, {
            name: "Marc",
            tags: ["mongo", "jenkins"]
        }
        ];
        return values;
    }
}