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
            connection.off('upgrade');
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
            const testTable = schema.tables[0];
            expect(testTable.autoIncColumnValue['id']).equal(3);

            const processIdColumn = testTable.columns[1];
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
        let isUpgradeCalled = false;
        connection.on("upgrade", (dataBase, oldVersion, newVersion) => {
            isUpgradeCalled = true;
            expect(db.version).equal(dataBase.version);
            expect(db.name).equal(dataBase.name);
            expect(db.tables.length).equal(dataBase.tables.length);
            expect(oldVersion).equal(2);
            expect(newVersion).equal(3);
        })
        let isOpenCalled = false;
        connection.on("open", () => {
            expect(isUpgradeCalled).to.be.an('boolean').equal(true);
            connection.off("upgrade");
            isOpenCalled = true;
        })
        let isCreateCalled = false;
        connection.on("create", () => {
            isCreateCalled = true;
        })
        connection.initDb(db).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(true);
            expect(isCreateCalled).to.be.an('boolean').equal(false);
            expect(isUpgradeCalled).to.be.an('boolean').equal(true);
            expect(isOpenCalled).to.be.an('boolean').equal(true);
            connection.off("open");
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

    it('create version v5 with skipping version 4', function (done) {
        var db = DbUpgradeTestV5.getDbSchema();
        let isUpgradeCalled = false;
        connection.on("upgrade", (dataBase, oldVersion, newVersion) => {
            isUpgradeCalled = true;
            expect(db.version).equal(dataBase.version);
            expect(db.name).equal(dataBase.name);
            expect(db.tables.length).equal(dataBase.tables.length);
            expect(oldVersion).equal(3);
            expect(newVersion).equal(5);
            const columns = dataBase.tables[0].columns;

            expect(Object.keys(columns)).length(4);

            expect(columns.id).not.null;
            expect(columns.name).not.null;
            expect(columns.name.dataType).equal('string');
            expect(columns.name.notNull).equal(true);

            expect(columns.gender.notNull).equal(undefined);
            expect(columns.gender.dataType).equal('string');

            expect(columns.s).to.be.undefined;
        })
        let isOpenCalled = false;
        connection.on("open", () => {
            expect(isUpgradeCalled).to.be.an('boolean').equal(true);
            connection.off("upgrade");
            isOpenCalled = true;
        })
        let isCreateCalled = false;
        connection.on("create", () => {
            isCreateCalled = true;
        })
        connection.initDb(db).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(true);
            expect(isCreateCalled).to.be.an('boolean').equal(false);
            expect(isUpgradeCalled).to.be.an('boolean').equal(true);
            expect(isOpenCalled).to.be.an('boolean').equal(true);
            connection.off("open");
            connection.off("create");
            done();
        }).catch(function (err) {
            done(err);
        });
    })

    it('count data to ensure data is there', function () {
        return connection.count({
            from: "test",
        }).then(results => {
            expect(results).to.equal(3);
        })
    })

    it('insert data', function () {
        return connection.insert({
            into: "test",
            values: [{
                process_id: 2
            }]
        }).then(results => {
            expect(results).to.equal(3);
        }).catch(err => {
            var error = {
                "message": "Null value is not allowed for column 'name'",
                "type": "null_value"
            };
            expect(err).to.be.an('object').eql(error);
        })
    })

    it('open db version v5', function (done) {
        var db = DbUpgradeTestV5.getDbSchema();
        let isUpgradeCalled = false;
        connection.on("upgrade", () => {
            isUpgradeCalled = true;
        })
        let isOpenCalled = false;
        connection.on("open", (dataBase) => {
            con.off("upgrade");
            isOpenCalled = true;

            expect(db.version).equal(dataBase.version);
            expect(db.name).equal(dataBase.name);
            expect(db.tables.length).equal(dataBase.tables.length);
            const testTable = dataBase.tables[0];
            const columns = testTable.columns;

            expect(Object.keys(columns)).length(4);

            expect(columns.id).not.null;
            expect(columns.name).not.null;
            expect(columns.name.dataType).equal('string');
            expect(columns.name.notNull).equal(true);

            expect(columns.gender.notNull).equal(undefined);
            expect(columns.gender.dataType).equal('string');

        })
        let isCreateCalled = false;
        connection.on("create", () => {
            isCreateCalled = true;
        })
        connection.initDb(db).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(false);
            expect(isCreateCalled).to.be.an('boolean').equal(false);
            expect(isUpgradeCalled).to.be.an('boolean').equal(false);
            expect(isOpenCalled).to.be.an('boolean').equal(true);
            connection.off("open");
            connection.off("create");
            done();
        }).catch(function (err) {
            done(err);
        });
    })

    it('insert data with name null', function () {
        return connection.insert({
            into: "test",
            values: [{
                process_id: 2
            }]
        }).then(results => {
            expect(results).to.equal(3);
        }).catch(err => {
            var error = {
                "message": "Null value is not allowed for column 'name'",
                "type": "null_value"
            };
            expect(err).to.be.an('object').eql(error);
        })
    })

    it('insert data with gender number', function () {
        return connection.insert({
            into: "test",
            values: [{
                process_id: 2,
                name: 'ujjwal',
                gender: 12
            }]
        }).then(results => {
            expect(results).to.equal(3);
        }).catch(err => {
            // throw err;
            var error = {
                "message": "Expected data type for the column gender is string, but received a number.",
                "type": "wrong_data_type"
            };
            expect(err).to.be.an('object').eql(error);
        })
    })

    it('select data to ensure data is there', function () {
        return connection.select({
            from: "test",
        }).then(results => {
            expect(results).length(3);
        })
    })

    it('insert valid data', function () {
        return connection.insert({
            into: "test",
            values: [{
                process_id: 2,
                name: 'ujjwal',
                gender: 'male'
            }]
        }).then(results => {
            expect(results).to.equal(1);
        })
    })

    it('select by name', function () {
        return connection.count({
            from: "test",
            where: {
                name: 'ujjwal'
            }
        }).then(results => {
            expect(results).to.equal(1);
        })
    })

    it('create version v6 with new table', function (done) {
        var db = DbUpgradeTestV6.getDbSchema();
        let isUpgradeCalled = false;
        connection.on("upgrade", (dataBase, oldVersion, newVersion) => {
            isUpgradeCalled = true;
            expect(db.version).equal(dataBase.version);
            expect(db.name).equal(dataBase.name);
            expect(db.tables.length).equal(dataBase.tables.length);
            expect(oldVersion).equal(5);
            expect(newVersion).equal(6);
        })
        let isOpenCalled = false;
        connection.on("open", () => {
            expect(isUpgradeCalled).to.be.an('boolean').equal(true);
            connection.off("upgrade");
            isOpenCalled = true;
        })
        let isCreateCalled = false;
        connection.on("create", () => {
            isCreateCalled = true;
        })
        connection.initDb(db).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(true);
            expect(isCreateCalled).to.be.an('boolean').equal(false);
            expect(isUpgradeCalled).to.be.an('boolean').equal(true);
            expect(isOpenCalled).to.be.an('boolean').equal(true);
            connection.off("open");
            connection.off("create");
            done();
        }).catch(function (err) {
            done(err);
        });
    })

    it('insert data into new table student added in v6', (done) => {
        connection.insert({
            into: "Students",
            return: true,
            values: [{
                city: "New Delhi",
                country: "India",
                name: "Ujjwal",
                gender: "male"
            }]
        }).then(function (result) {
            expect(result).to.length(1);
            expect(result[0]).to.eql({
                city: "New Delhi",
                country: "India",
                name: "Ujjwal",
                gender: "male",
                id: 1
            });
            done();
        }).catch(done)
    })

    it('create version v7 -  new table', function (done) {
        var db = DbUpgradeTestV7.getDbSchema();
        let isUpgradeCalled = false;
        connection.on("upgrade", (dataBase, oldVersion, newVersion) => {
            isUpgradeCalled = true;
            expect(db.version).equal(dataBase.version);
            expect(db.name).equal(dataBase.name);
            expect(db.tables.length).equal(dataBase.tables.length);
            expect(oldVersion).equal(6);
            expect(newVersion).equal(7);
        })
        let isOpenCalled = false;
        connection.on("open", () => {
            expect(isUpgradeCalled).to.be.an('boolean').equal(true);
            connection.off("upgrade");
            isOpenCalled = true;
        })
        let isCreateCalled = false;
        connection.on("create", () => {
            isCreateCalled = true;
        })
        connection.initDb(db).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(true);
            expect(isCreateCalled).to.be.an('boolean').equal(false);
            expect(isUpgradeCalled).to.be.an('boolean').equal(true);
            expect(isOpenCalled).to.be.an('boolean').equal(true);
            connection.off("open");
            connection.off("create");
            done();
        }).catch(function (err) {
            done(err);
        });
    })

    it("insert new data", function (done) {
        connection.insert({
            into: "Students",
            return: true,
            values: [{
                city: "New Delhi",
                country: "India",
                name: "Ujjwal",
                gender: "male"
            }]
        }).then(function (result) {
            expect(result).to.length(1);
            expect(result[0]).to.eql({
                city: "New Delhi",
                country: "India",
                name: "Ujjwal",
                gender: "male",
                id: 2,
                tempId: 1
            });
            done();
        }).catch(done)
    })

    it('create version v8 - delete new table', function (done) {
        var db = DbUpgradeTestV7.getDbSchema();
        db.version = 8;
        db.tables.splice(0, 1);
        let isUpgradeCalled = false;
        connection.on("upgrade", (dataBase, oldVersion, newVersion) => {
            isUpgradeCalled = true;
            expect(db.version).equal(dataBase.version);
            expect(db.name).equal(dataBase.name);
            expect(db.tables.length).equal(dataBase.tables.length);
            expect(oldVersion).equal(7);
            expect(newVersion).equal(8);
        })
        let isOpenCalled = false;
        connection.on("open", () => {
            expect(isUpgradeCalled).to.be.an('boolean').equal(true);
            connection.off("upgrade");
            isOpenCalled = true;
        })
        let isCreateCalled = false;
        connection.on("create", () => {
            isCreateCalled = true;
        })
        connection.initDb(db).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(true);
            expect(isCreateCalled).to.be.an('boolean').equal(false);
            expect(isUpgradeCalled).to.be.an('boolean').equal(true);
            expect(isOpenCalled).to.be.an('boolean').equal(true);
            connection.off("open");
            connection.off("create");
            done();
        }).catch(function (err) {
            done(err);
        });
    })

    it('open db version v8', function (done) {
        var db = DbUpgradeTestV7.getDbSchema();
        db.version = 8;
        db.tables.splice(0, 1);

        let isUpgradeCalled = false;
        connection.on("upgrade", () => {
            isUpgradeCalled = true;
        })
        let isOpenCalled = false;
        connection.on("open", (dataBase) => {
            con.off("upgrade");
            connection.off("upgrade");
            isOpenCalled = true;

            expect(db.version).equal(dataBase.version);
            expect(db.name).equal(dataBase.name);
            expect(db.tables.length).equal(dataBase.tables.length);
            const testTable = dataBase.tables[0];
            const columns = testTable.columns;

            expect(Object.keys(columns)).length(5);

            expect(columns.id).not.null;
            expect(columns.name).not.null;
            expect(columns.name.dataType).equal('string');
            expect(columns.name.notNull).equal(true);

            expect(columns.gender.notNull).equal(undefined);
            expect(columns.gender.dataType).equal('string');

        })
        let isCreateCalled = false;
        connection.on("create", () => {
            isCreateCalled = true;
        })
        connection.initDb(db).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(false);
            expect(isCreateCalled).to.be.an('boolean').equal(false);
            expect(isUpgradeCalled).to.be.an('boolean').equal(false);
            expect(isOpenCalled).to.be.an('boolean').equal(true);
            connection.off("open");
            connection.off("create");
            done();
        }).catch(function (err) {
            done(err);
        });
    })

    it('drop db', function () {
        return connection.dropDb();
    })

    it('create version v8 again after dropping database', function (done) {
        var db = DbUpgradeTestV7.getDbSchema();
        db.version = 8;
        let isCreateCalled = false;
        connection.on("create", (dataBase) => {
            isCreateCalled = true;
            expect(db.version).equal(dataBase.version);
            expect(db.name).equal(dataBase.name);
            expect(db.tables.length).equal(dataBase.tables.length);
            // done(dataBase);
            // return;
            expect(dataBase).to.eql({
                name: "DbUpgradeTest",
                version: 8,
                tables: [
                    {
                        name: "test",
                        columns: {
                            id: {
                                primaryKey: true,
                                dataType: "number",
                                autoIncrement: true,
                                notNull: true,
                                name: "id",
                                enableSearch: true
                            },
                            process_id: {
                                dataType: "number",
                                encrypt: true,
                                name: "process_id",
                                enableSearch: true
                            },
                            name: {
                                dataType: "string",
                                name: "name",
                                enableSearch: true,
                                notNull: true
                            },
                            gender: {
                                dataType: "string",
                                name: "gender",
                                enableSearch: true
                            }
                        }
                    },
                    {
                        name: "Students",
                        columns: {
                            id: {
                                primaryKey: true,
                                autoIncrement: true,
                                name: "id",
                                enableSearch: true
                            },
                            name: {
                                notNull: true,
                                dataType: "string",
                                name: "name",
                                enableSearch: true
                            },
                            gender: {
                                dataType: "string",
                                default: "male",
                                name: "gender",
                                enableSearch: true
                            },
                            country: {
                                notNull: true,
                                dataType: "string",
                                name: "country",
                                enableSearch: true
                            },
                            city: {
                                dataType: "string",
                                notNull: true,
                                name: "city",
                                enableSearch: true
                            },
                            tempId: {
                                dataType: "number",
                                autoIncrement: true,
                                notNull: true,
                                name: "tempId",
                                enableSearch: true
                            }
                        }
                    },
                    {
                        name: "JsStore_Meta",
                        columns: {
                            key: {
                                primaryKey: true,
                                name: "key",
                                enableSearch: true
                            },
                            value: {
                                enableSearch: false,
                                name: "value"
                            }
                        }
                    }
                ]
            });
            expect(isCreateCalled).to.be.an('boolean').equal(true);
            connection.off("create");
            isOpenCalled = true;
        })
        connection.initDb(db).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(true);
            expect(isCreateCalled).to.be.an('boolean').equal(true);
            expect(isOpenCalled).to.be.an('boolean').equal(true);
            connection.off("open");
            connection.off("create");
            done();
        }).catch(function (err) {
            done(err);
        });
    })

    it("insert new data in students table - check for tempId", function () {
        return connection.insert({
            into: "Students",
            return: true,
            values: [{
                city: "New Delhi",
                country: "India",
                name: "Ujjwal",
                gender: "male"
            }]
        }).then(function (result) {
            expect(result).to.length(1);
            // throw result;
            expect(result[0]).to.eql({
                city: "New Delhi",
                country: "India",
                name: "Ujjwal",
                gender: "male",
                id: 1,
                tempId: 1
            });
        });
    })

    it("insert new data in test table - without name", function () {
        return connection.insert({
            into: "test",
            return: true,
            values: [{
                "process_id": 2,
            }]
        }).catch(err => {
            expect(err).to.eql({
                "message": "Null value is not allowed for column 'name'",
                "type": "null_value"
            });
        })
    })

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

    var DbUpgradeTestV5 = {
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

                alter: {
                    4: {
                        add: {
                            name: {
                                dataType: 'string'
                            },
                            "id": {
                                "primaryKey": true,
                                "dataType": "number",
                                "autoIncrement": true,
                                "notNull": true
                            },
                        },
                    },
                    5: {
                        add: {
                            gender: {
                                dataType: 'string'
                            }
                        },
                        modify: {
                            name: {
                                notNull: true
                            }
                        },
                    },
                }

            },
                dataBase = {
                    name: 'DbUpgradeTest',
                    tables: [people],
                    version: 5
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
    var DbUpgradeTestV6 = {
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

                alter: {
                    4: {
                        add: {
                            name: {
                                dataType: 'string'
                            },
                            "id": {
                                "primaryKey": true,
                                "dataType": "number",
                                "autoIncrement": true,
                                "notNull": true
                            },
                        },
                    },
                    5: {
                        add: {
                            gender: {
                                dataType: 'string'
                            }
                        },
                        modify: {
                            name: {
                                notNull: true
                            }
                        },
                    },
                }

            },
                tableStudent = {

                    name: 'Students',
                    columns: {
                        id: {
                            primaryKey: true,
                            autoIncrement: true
                        },
                        name: {
                            notNull: true,
                            dataType: JsStore.DATA_TYPE.String
                        },
                        gender: {
                            dataType: JsStore.DATA_TYPE.String,
                            default: 'male'
                        },
                        country: {
                            notNull: true,
                            dataType: JsStore.DATA_TYPE.String
                        },
                        city: {
                            dataType: JsStore.DATA_TYPE.String,
                            notNull: true
                        }
                    }

                },
                dataBase = {
                    name: 'DbUpgradeTest',
                    tables: [people, tableStudent],
                    version: 6
                };
            return dataBase;
        }
    }
    var DbUpgradeTestV7 = {
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

                alter: {
                    4: {
                        add: {
                            name: {
                                dataType: 'string'
                            },
                            "id": {
                                "primaryKey": true,
                                "dataType": "number",
                                "autoIncrement": true,
                                "notNull": true
                            },
                        },
                    },
                    5: {
                        add: {
                            gender: {
                                dataType: 'string'
                            }
                        },
                        modify: {
                            name: {
                                notNull: true
                            }
                        },
                    },
                }

            },
                tableStudent = {

                    name: 'Students',
                    columns: {
                        id: {
                            primaryKey: true,
                            autoIncrement: true
                        },
                        name: {
                            notNull: true,
                            dataType: JsStore.DATA_TYPE.String
                        },
                        gender: {
                            dataType: JsStore.DATA_TYPE.String,
                            default: 'male'
                        },
                        country: {
                            notNull: true,
                            dataType: JsStore.DATA_TYPE.String
                        },
                        city: {
                            dataType: JsStore.DATA_TYPE.String,
                            notNull: true
                        }
                    },
                    alter: {
                        7: {
                            add: {
                                "tempId": {
                                    "dataType": "number",
                                    "autoIncrement": true,
                                    "notNull": true
                                },
                            },
                        },
                    }
                },
                dataBase = {
                    name: 'DbUpgradeTest',
                    tables: [people, tableStudent],
                    version: 7
                };
            return dataBase;
        }
    }

});

