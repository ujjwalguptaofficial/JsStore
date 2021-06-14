describe('Db upgrade Test', function () {
    var connection = new JsStore.Connection();

    it('create db DbUpdateTest', function (done) {
        var db = DbUpgradeTest.getDbSchema();
        connection.initDb(db).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(true);
            done();
        }).catch(function () {
            done("dff")
        })
        console.log("executing create db 3");

    });

    it('insert data', function () {
        var values = DbUpgradeTest.getValues();
        return connection.insert({
            into: "test",
            values: values
        }).then(results => {
            expect(results).to.equal(3);
        })
    })

    it('getDbSchema', function (done) {
        connection.openDb(DbUpgradeTest.getDbSchema().name).then(function (schema) {
            const processIdColumn = schema.tables[0].columns[1];
            expect(processIdColumn.name).to.equal("process_id");
            expect(processIdColumn.dataType).to.equal("number");
            expect(schema.tables[0].columns[1].encrypt).equal(true)
            expect(schema.version).equal(1);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('change db to v2', function (done) {
        var db = DbUpgradeTest.getDbSchema();
        db.version = 2;
        connection.initDb(db).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(true);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('open db with old version', function () {
        connection.openDb("DbUpgradeTest").catch(function (err) {
            console.error(JSON.stringify(err));
            const expected = {
                "message": "The requested version (1) is less than the existing version (2).",
                "type": "VersionError"
            };
            expect(err.type).to.equal(expected.type);
            done();
        });
    })


    it('getDbSchema after updating db', function (done) {
        connection.openDb("DbUpgradeTest", 2).then(function (schema) {
            const processIdColumn = schema.tables[0].columns[1];
            expect(processIdColumn.name).to.equal("process_id");
            expect(processIdColumn.dataType).to.equal("number");
            // expect(schema.tables[0].version).equal(2)

            expect(schema.version).equal(2);
            expect(schema.tables[0].columns[1].encrypt).equal(true)
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('count data to ensure data is not deleted', function () {
        return connection.count({
            from: "test",
        }).then(results => {
            expect(results).to.equal(3);
        })
    })

    it('change db to v3', function (done) {
        var db = DbUpgradeTest.getDbSchema();
        db.version = 3;
        db.tables[0].columns.process_id.encrypt = false;
        connection.initDb(db).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(true);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('count data to ensure data is there', function () {
        return connection.count({
            from: "test",
        }).then(results => {
            expect(results).to.equal(3);
        })
    })

    it('getDbSchema after updating db to v3', function (done) {
        connection.openDb("DbUpgradeTest", 3).then(function (schema) {
            const processIdColumn = schema.tables[0].columns[1];
            expect(processIdColumn.name).to.equal("process_id");
            expect(processIdColumn.dataType).to.equal("number");
            // expect(schema.tables[0].version).equal(2)
            expect(schema.version).equal(3);
            expect(schema.tables[0].columns[1].encrypt).equal(false)
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('drop db', function () {
        return connection.dropDb();
    })

});

var DbUpgradeTest = {
    getDbSchema: function () {
        var people = {
            "name": "test",
            "columns":
            {
                "id": {
                    "primaryKey": true,
                    "dataType": "number",
                    "autoIncrement": true,
                    "notNull": true
                },
                "process_id": {
                    "dataType": "number",
                    encrypt: true
                },
            },

        },
            dataBase = {
                name: 'DbUpgradeTest',
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