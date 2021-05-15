describe('Db Update data type Test', function () {
    it('terminate connection', function (done) {
        con.terminate().then(function () {
            con = new JsStore.Connection();
            done();
        }).catch(function (error) {
            done(error);
        });
    });

    it('create db DbUpdateTest', function (done) {
        var db = DbUpdateTest.getDbSchema();
        console.log("executing create db 1");
        console.log(db)
        con.initDb(db).then(function (isDbCreated) {
            console.log("executing create db 2");

            expect(isDbCreated).to.be.an('boolean').equal(true);
            done();
        }).catch(function () {
            done("dff")
        })
        console.log("executing create db 3");

    });

    it('getDbSchema', function (done) {
        con.openDb("DbUpdateTest").then(function (schema) {
            const processIdColumn = schema.tables[0].columns[1];
            expect(processIdColumn.name).to.equal("process_id");
            expect(processIdColumn.dataType).to.equal("number");
            expect(schema.tables[0].version).equal(1)
            expect(schema.version).equal(1);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('change db', function (done) {
        var db = DbUpdateTest.getV2DbSchema();
        con.initDb(db).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(true);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('getDbSchema after updating db', function (done) {
        con.openDb("DbUpdateTest").then(function (schema) {
            const processIdColumn = schema.tables[0].columns[1];
            expect(processIdColumn.name).to.equal("process_id");
            expect(processIdColumn.dataType).to.equal("string");
            expect(schema.tables[0].version).equal(2);
            expect(schema.version).equal(2);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

});

var DbUpdateTest = {
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
                    "dataType": "number"
                },
            },

        },
            dataBase = {
                name: 'DbUpdateTest',
                tables: [people]
            };
        return dataBase;
    },
    getV2DbSchema: function () {
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
                    "dataType": "string"
                },
            },
            version: 2
        },
            dataBase = {
                name: 'DbUpdateTest',
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