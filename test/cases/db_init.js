
describe("initiate database", function () {
    before(function () {
        console.log('initiate database');
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        if (isIE) {
            console.log('test runing for ie');
            con = new JsStore.Instance(new Worker('../output/jsstore.worker.ie.min.js'));
        } else {
            if (typeof isRuningForSauceLab != 'undefined' && isRuningForSauceLab) {
                console.log("test runing for sauce lab");
                con = new JsStore.Instance(new Worker('../output/jsstore.worker.min.js'));
            } else if (typeof isRuningForProd != 'undefined' && isRuningForProd) {
                console.log("test runing for production");
                con = new JsStore.Instance(new Worker('../output/jsstore.worker.min.js'));
            } else {
                console.log("test runing for development");
                con = new JsStore.Instance(new Worker('output/jsstore.worker.js'));
                // con.setLogStatus(true);
            }
        }
        // con.setLogStatus(true);
    })

    it("db exist", function (done) {
        con.isDbExist('Demo').then(function (exist) {
            console.log('db exist :' + exist);
            if (exist) {
                con.openDb('Demo').then(done);
            } else {
                con.createDb(getDemoDbSchema()).then(function () {
                    console.log('Database created');
                    done();
                });
            }
        }).catch(function (err) {
            done(err);
        });
    })
})

const getDemoDbSchema = function () {

    var customers = {
        name: 'Customers',
        columns: {
            CustomerID: ['primaryKey', 'autoIncrement'],
            CustomerName: ['notNull', 'string'],
            ContactName: ['notNull', 'string'],
            Address: ['notNull', 'string'],
            City: ['notNull', 'string'],
            PostalCode: ['string'],
            Country: ['notNull', 'string'],
            Email: ['string', '!enableSearch']
        }
    };

    var categories = {
        name: 'Categories',
        columns: {
            CategoryID: ['primaryKey', 'autoIncrement'],
            CategoryName: ['notNull', 'string'],
            Description: ['notNull', 'string']
        }
    }



    var employees = {
        name: 'Employees',
        columns: {
            employeeId: ['primaryKey', 'autoIncrement'],
            lastName: ['notNull', 'string'],
            birthDate: ['notNull', 'Date_Time'],
            photo: ['notNull', 'string'],
            notes: ['string'],
            state: ['notnull', 'string'],
            jobSuspendedFlag: ['notnull', 'number']
        }
    }

    var orderDetails = {
        name: 'OrderDetails',
        columns: {
            OrderDetailID: ['primaryKey', 'autoIncrement'],
            OrderID: ['notnull', 'number'],
            ProductID: ['notnull', 'number'],
            Quantity: ['notnull', 'number'],
        }
    }

    var orders = {
        name: 'Orders',
        columns: {
            OrderID: ['primaryKey'],
            CustomerID: ['notNull'],
            EmployeeID: ['notnull', 'number'],
            OrderDate: ['notnull', 'string'],
            ShipperID: ['notnull', 'number']
        }
    }

    var products = {
        name: 'Products',
        columns: {
            ProductID: ['primaryKey', 'autoIncrement'],
            ProductName: ['notnull', 'string'],
            SupplierID: ['notnull', 'number'],
            CategoryID: ['notnull', 'number'],
            Unit: ['notnull', 'string'],
            Price: ['notnull', 'number'],
        }
    }

    var shippers = {
        name: 'Shippers',
        columns: {
            ShipperID: ['primaryKey', 'autoIncrement'],
            ShipperName: ['notnull', 'string'],
            Phone: ['notnull', 'string']
        }
    }

    var suppliers = {
        name: 'Suppliers',
        columns: {
            SupplierID: ['primaryKey', 'autoIncrement'],
            SupplierName: ['notnull', 'string'],
            ContactName: ['notnull', 'string'],
            Address: ['notnull', 'string'],
            City: ['notnull', 'string'],
            PostalCode: ['notnull', 'string'],
            Country: ['notnull', 'string'],
            Phone: ['notnull', 'string'],
        }
    }

    var things = {
        name: "things",
        columns: {
            value: ['string']
        }
    }

    var dataBase = {
        name: "Demo",
        tables: [customers, categories, employees, orderDetails, orders, products, shippers, suppliers, things]
    };
    return dataBase;
}