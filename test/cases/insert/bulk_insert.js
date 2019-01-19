describe('Test bulkInsert', function () {
    it('insert OrderDetails', function (done) {
        $.getJSON("test/static/OrderDetails.json", function (results) {
            con.bulkInsert({
                into: 'OrderDetails',
                values: results,
            }).then(function (results) {
                expect(results).to.be.an('undefined');
                done();
            }).
            catch(function (err) {
                done(err);
            });
        });
    });

    it('wrong table test', function (done) {
        con.bulkInsert({
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
        con.bulkInsert({
            into: 'Customers'
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