describe('Test bulkInsert', function () {
    it('settimeout', function (done) {
        setTimeout(done, 2000);
    });

    it('insert OrderDetails', function (done) {
        $.getJSON("test/static/OrderDetails.json", function (results) {
            con.insert({
                into: 'OrderDetails',
                values: results,
                skipDataCheck: true
            }).then(function (results) {
                expect(results).to.be.an('number');
                done();
            }).
                catch(function (err) {
                    done(err);
                });
        });
    });

    it('wrong table test', function (done) {
        con.insert({
            into: 'Custamer'
        }).
            catch(function (err) {
                console.log(err);
                var error = {
                    message: "Table 'Custamer' does not exist",
                    type: "table_not_exist"
                };
                expect(err).to.be.an('object').eql(error);
                done();
            })
    });

    it('without value', function (done) {
        con.insert({
            into: 'Customers',
            skipDataCheck: true
        }).
            catch(function (err) {
                console.log(err);
                var error = {
                    message: 'No value is supplied',
                    type: 'no_value_supplied'
                };
                expect(err).to.be.an('object').eql(error);
                done();
            })
    });
});