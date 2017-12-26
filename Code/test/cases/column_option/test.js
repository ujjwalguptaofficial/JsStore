describe('Multi Entry Test', function () {
    it('create db with promise', function (done) {
        JsStore.isDbExist('MultiEntryTest').then(function (exist) {
            console.log('db exist :' + exist);
            if (exist) {
                Con.openDb('MultiEntryTest', onDbInit);
                done();
            } else {
                Con.createDb(MultiEntryTest.getDbSchema(), function (tableList) {
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
            Into: 'people',
            Values: MultiEntryTest.getValues()
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
            From: 'people',
            Where: {
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
        JsStore.isDbExist({
            DbName: 'MultiEntryTest',
            Table: {
                Name: 'person',
                Version: 2
            }
        }).then(function (exist) {
            console.log('db exist :' + exist);
            if (exist) {
                Con.openDb('MultiEntryTest');
                done();
            } else {
                var Db = MultiEntryTest.getDbSchema();
                Db.Tables[0].Version = 2;
                Db.Tables[0].Columns[1].MultiEntry = true;
                Con.createDb(Db, function (tableList) {
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
        Con.insert({
            Into: 'people',
            Values: MultiEntryTest.getValues()
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
            From: 'people',
            Where: {
                tags: 'mongo'
            }
        }).
        then(function (results) {
            expect(results).to.be.an('array').length(1);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

});

MultiEntryTest = {
    getDbSchema: function () {
        var people = {
                Name: 'people',
                Columns: [{
                        Name: 'name',
                        Unique: true,
                        DataType: 'string'
                    },
                    {
                        Name: 'tags'
                    }
                ]
            },
            data_base = {
                Name: 'MultiEntryTest',
                Tables: [people]
            };
        return data_base;
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