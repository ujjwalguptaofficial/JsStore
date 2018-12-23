function getDashboardSchema() {
    var db = {
        "name": "Dashboard",
        "tables": [{
            "name": "Job",
            "columns": [{
                    "name": "__lastEdit",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "__id",
                    "primaryKey": true,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "job_assignedFutureDTS",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "job_assignedLab_External__id",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "job_assignedLab_Primary__id",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "job_assignedLab_Secondary__id",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "job_assignedPartner__id",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "job_assignedPoS__id",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getAssignedLab_Primary__location____id",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getAssignedLab_Secondary__location____id",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getAssignedPoS__location____id",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "__lastOperationTimestamp",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getClientFullName",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "device_details__fullDescription",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "device_details__category",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "device_details__family",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "device_details__vendor",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getReadableFullTicket",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getCurrentDts",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getCurrentState",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getLastAssignedTechnicianFullName",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "job_suspended_flag",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getCurrentDept__location__id",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "job_expiryEndDate",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "job_expiryStartDate",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getDateClosure",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getDateCreation",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getDateEndJob",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getDateFirstEntryLab1",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getDateFirstEntryLab2",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getDateLastExitLab1",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getDateLastExitLab2",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                },
                {
                    "name": "_getDateStartJob",
                    "primaryKey": false,
                    "dataType": "string",
                    "enableSearch": true
                }, {
                    name: '__lastStateChange',
                    dataType: 'number'
                }
            ],
            "version": 1
        }]
    };
    return db;
}

describe("dashboard test", function () {
    var connection;
    it('create dashboard database', function (done) {
        connection = new JsStore.Instance();
        var dbName = "Dashboard";
        connection.isDbExist(dbName).then(function (isExist) {
            if (isExist) {
                connection.openDb(dbName);
            } else {
                var db = getDashboardSchema();
                connection.createDb(db);
            }
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('insert into job', function (done) {
        $.getJSON("test/static/Jobs.json", function (results) {
            connection.insert({
                into: 'Job',
                values: results,
                skipDataCheck: true
            }).then(function (recordInserted) {
                expect(recordInserted).to.be.an('number').equal(26);
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
                _getCurrentState: { in: ['Send', 'Transit', 'WaitStart', 'Diagnostics', 'ExternalLab', 'WaitApproval', 'WaitContinue',
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
});