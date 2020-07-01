function getDashboardSchema() {
    var db = {
        "name": "Dashboard",
        "tables": [{
            "name": "Job",
            "columns": {
                __lastEdit: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                __id: {
                    "primaryKey": true,
                    "dataType": "string",
                    "enableSearch": true
                },
                job_assignedFutureDTS: {
                    "name": "",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                job_assignedLab_External__id: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                job_assignedLab_Primary__id: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                job_assignedLab_Secondary__id: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                job_assignedPartner__id: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                job_assignedPoS__id: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getAssignedLab_Primary__location____id: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getAssignedLab_Secondary__location____id: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getAssignedPoS__location____id: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                __lastOperationTimestamp: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getClientFullName: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                device_details__fullDescription: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                device_details__category: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                device_details__family: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                device_details__vendor: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getReadableFullTicket: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getCurrentDts: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getCurrentState: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getLastAssignedTechnicianFullName: {
                    "name": "",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                job_suspended_flag: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getCurrentDept__location__id: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                job_expiryEndDate: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                job_expiryStartDate: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getDateClosure: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getDateCreation: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getDateEndJob: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getDateFirstEntryLab1: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getDateFirstEntryLab2: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getDateLastExitLab1: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getDateLastExitLab2: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                _getDateStartJob: {
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                }, __lastStateChange: {
                    dataType: 'number'
                }
            },
            "version": 1
        }
        ]
    };
    return db;
}

describe("dashboard test", function () {
    var connection;
    it('create dashboard database', function (done) {
        connection = new JsStore.Instance();
        var dbName = "Dashboard";
        var db = getDashboardSchema();
        connection.initDb(db).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(true);
            console.log('Database created');
            done();
        });
    });

    it('insert into job', function (done) {
        $.getJSON("test/static/Jobs.json", function (results) {
            var transaction_query = {
                tables: ['Job'],
                logic: function (ctx) {
                    ctx.insert({
                        into: 'Job',
                        values: results,
                        skipDataCheck: true
                    }).then(function (recordInserted) {
                        ctx.setResult('recordInserted', recordInserted);
                    })
                    ctx.start()
                }
            }
            connection.transaction(transaction_query).then(function (results) {
                expect(results.recordInserted).to.be.an('number').equal(26);
                done();
            }).catch(function (err) {
                done(err);
            })
        });
    });

    it('check null ordering of dashboard', function (done) {
        connection.select({
            from: 'Job',
            where: [{
                _getCurrentState: {
                    in: ['Send', 'Transit', 'WaitStart', 'Diagnostics', 'ExternalLab', 'WaitApproval', 'WaitContinue',
                        'Working', 'WaitParts', 'FinalTest'
                    ],
                },
            }],
            order: {
                by: '__lastStateChange',
                type: 'asc',
            },
            limit: 20
        }).then(function (result) {
            var expectedValues = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 1532258160, 1532258219];
            var returnedValues = [];
            result.forEach(function (value) {
                returnedValues.push(value.__lastStateChange);
            });
            expect(returnedValues).to.deep.equal(expectedValues);
            done();
        }).catch(function (err) {
            done(err);
        });
    });


    it('terminate connection', function (done) {
        connection.terminate().then(function () {
            done();
        }).catch(function (error) {
            done(error);
        });
    });
});