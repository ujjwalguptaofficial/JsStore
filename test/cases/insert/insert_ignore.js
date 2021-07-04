describe('Insert ignore', function () {

    it('wrong table test', function (done) {
        con.insert({
            into: 'Custamer',
            ignore: true
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
            skipDataCheck: true,
            ignore: true
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

    var connection = new JsStore.Connection();

    it('init db', function () {
        var db = getDbSchemaForInsertIgnore();
        return connection.initDb(db).then(result => {
            expect(result).to.equal(true);
        })
    })

    it('insert data into Categories table', function (done) {
        $.getJSON("test/static/Categories.json", function (results) {
            // var startDate = new Date(1994, 0, 1);
            // var endDate = new Date();
            // results.forEach(function (value) {
            //     value.id = value
            // });

            connection.insert({
                into: 'Categories',
                validation: false,
                values: results,
                ignore: true
            }).then(function (results) {
                expect(results).to.be.an('number').to.equal(8);
                done();
            }).catch(function (err) {
                done(err);
            });
        });
        // return connection.insert({
        //     into: "Categories",
        //     validation: false,
        //     values: [{
        //         categoryName: "Beverages",
        //         description: "Soft drinks, coffees, teas, beers, and ales"
        //     }]
        // }).then(result => {
        //     expect(result).to.equal(1);
        // })
    })

    it('insert data with ignore & duplicate primarykey', function () {

        return connection.insert({
            into: "Categories",
            ignore: true,
            values: [{
                id: 1,
                categoryName: "Beverages",
                description: "Soft drinks, coffees, teas, beers, and ales"
            }]
        }).then(result => {
            expect(result).to.equal(0);
        })
    })

    it('insert data with ignore & duplicate primarykey, valid data', function () {

        return connection.insert({
            into: "Categories",
            ignore: true,
            values: [
                {
                    id: 1,
                    categoryName: "Beverages",
                    description: "Soft drinks, coffees, teas, beers, and ales"
                },
                {
                    categoryName: "Condiments",
                    description: "Sweet and savory sauces, relishes, spreads, and seasonings"
                },
            ]
        }).then(result => {
            expect(result).to.equal(1);
        })
    })

    it('insert data  with null value in one column', function () {

        return connection.insert({
            into: "Categories",
            ignore: true,
            values: [{
                categoryName: null,
                description: "Soft drinks, coffees, teas, beers, and ales"
            },
            {
                categoryName: "Dairy Products",
                description: "Cheeses"
            }
            ]
        }).then(result => {
            expect(result).to.equal(1);
        })
    })

    it('insert data  with random error', function () {

        return connection.insert({
            into: "Categories",
            ignore: true,
            values: [
                {
                    categoryName: null,
                    description: "Soft drinks, coffees, teas, beers, and ales"
                },
                {
                    categoryName: "Dairy Products",
                    description: "Cheeses"
                },
                {
                    id: 1,
                    categoryName: "Beverages",
                    description: "Soft drinks, coffees, teas, beers, and ales"
                },
                {
                    categoryName: "Condiments",
                    description: "Sweet and savory sauces, relishes, spreads, and seasonings"
                },
            ]
        }).then(result => {
            expect(result).to.equal(2);
        })
    })


    it('drop db', function () {
        return connection.dropDb();
    })

    function getDbSchemaForInsertIgnore() {
        var categories = {
            name: 'Categories',
            columns: {
                id: { primaryKey: true, autoIncrement: true },
                categoryName: { notNull: true, dataType: 'string' },
                description: { notNull: true, dataType: 'string' }
            }
        }
        var db = {
            name: "insertIgnore",
            tables: [categories]
        }
        return db;
    }
});