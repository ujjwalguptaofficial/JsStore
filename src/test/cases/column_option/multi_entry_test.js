describe('Multi Entry Test', function () {
    it('terminate connection', function (done) {
        Con.terminate().then(function () {
            Con = new JsStore.Instance();
            done();
        }).catch(function (error) {
            done(error);
        });
    });

    it('create db with promise', function (done) {
        Con.isDbExist('MultiEntryTest').then(function (exist) {
            console.log('db exist :' + exist);
            if (exist) {
                Con.openDb('MultiEntryTest').then(function () {
                    done();
                });

            } else {
                Con.createDb(MultiEntryTest.getDbSchema()).then(function (tableList) {
                    expect(tableList).to.be.an('array').length(1);
                    console.log('Database created');
                    done();
                });
            }
        }).
        catch(function (err) {
            done(err);
        });
    });

    it('insert data into table', function (done) {
        Con.insert({
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

    it('multientry test without multientry column - select data from array', function (done) {
        Con.select({
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
        Con.isDbExist({
            dbName: 'MultiEntryTest',
            table: {
                name: 'person',
                version: 2
            }
        }).then(function (exist) {
            console.log('db exist :' + exist);
            if (exist) {
                Con.openDb('MultiEntryTest');
                done();
            } else {
                var Db = MultiEntryTest.getDbSchema();
                Db.tables[0].version = 2;
                Db.tables[0].columns[1].multiEntry = true;
                Con.createDb(Db).then(function (tableList) {
                    expect(tableList).to.be.an('array').length(1);
                    console.log('Database created');
                    done();
                });
            }
        }).catch(function (err) {
            done(err);
        });
    });

    it('insert data into table multiEntryTest', function (done) {
        var values = MultiEntryTest.getValues();
        //console.log(values);
        Con.insert({
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
        Con.select({
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

    it('unique column test', function (done) {
        var value = {
            name: "Ray",
            tags: ["apple", "banana", "beer"]
        };
        Con.insert({
            into: 'people',
            values: [value]
        }).
        catch(function (err) {
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
        Con.insert({
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
        Con.update({ in: 'people',
            where: {
                name: 'Scott'
            },
            set: {
                tags: []
            }
        }).then(function (rowsUpdated) {
            Con.select({
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
        }).catch(function (err) {
            done(err);
        })
    });

    it('Array column update to null value', function (done) {
        Con.update({ in: 'people',
            where: {
                name: 'Scott'
            },
            set: {
                tags: null
            }
        }).then(function (rowsUpdated) {
            Con.select({
                from: 'people',
                where: {
                    name: 'Scott'
                }
            }).
            then(function (results) {
                var result = results[0];
                expect(results).to.be.an('array').length(1);
                expect(result['tags']).to.be.an('null');
                done();
            }).
            catch(function (err) {
                done(err);
            })
        }).catch(function (err) {
            done(err);
        })
    });
});

var MultiEntryTest = {
    getDbSchema: function () {
        var people = {
                name: 'people',
                columns: [{
                        name: 'name',
                        unique: true,
                        dataType: JsStore.DATA_TYPE.String
                    },
                    {
                        name: 'tags',
                        dataType: JsStore.DATA_TYPE.Array
                    }
                ]
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