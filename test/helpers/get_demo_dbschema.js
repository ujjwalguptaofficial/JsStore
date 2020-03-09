var getDemoDbSchema = function () {

    var DATA_TYPE = JsStore.DATA_TYPE;

    var customers = {
        name: 'Customers',
        columns: {
            customerId: { primaryKey: true, autoIncrement: true },
            customerName: { notNull: true, dataType: DATA_TYPE.String },
            contactName: { notNull: true, dataType: DATA_TYPE.String },
            address: { notNull: true, dataType: 'string' },
            city: { notNull: true, dataType: 'string' },
            postalCode: { dataType: 'string' },
            country: { notNull: true, dataType: 'string' },
            email: { dataType: 'string' }
        }
    };

    var categoriesGarbage = {
        name: 'Categories_Garbage',
        columns: {
            categoryId: { primaryKey: true, autoIncrement: true },
            categoryName: { notNull: true, dataType: 'string' },
            description: { notNull: true, dataType: 'string' },
            invalidColumn: { notNull: true, dataType: 'string', enableSearch: false }
        }
    }

    var categories = {
        name: 'Categories',
        columns: {
            categoryId: { primaryKey: true, autoIncrement: true },
            categoryName: { notNull: true, dataType: 'string' },
            description: { notNull: true, dataType: 'string' }
        }
    }



    var employees = {
        name: 'Employees',
        columns: {
            employeeId: { primaryKey: true, autoIncrement: true },
            lastName: { notNull: true, dataType: 'string' },
            birthDate: { notNull: true, dataType: DATA_TYPE.DateTime },
            photo: { notNull: true, dataType: 'string' },
            notes: { dataType: 'string' },
            state: { notNull: true, dataType: 'string' },
            jobSuspendedFlag: { notNull: true, dataType: 'number' }
        }
    }

    var orderDetails = {
        name: 'OrderDetails',
        columns: {
            orderDetailId: { primaryKey: true, autoIncrement: true },
            orderId: { notNull: true, dataType: 'number' },
            productId: { notNull: true, dataType: 'number' },
            quantity: { notNull: true, dataType: 'number' },
        }
    }

    var orders = {
        name: 'Orders',
        columns: {
            orderId: { primaryKey: true },
            customerId: { notNull: true },
            employeeId: { notNull: true, dataType: 'number' },
            orderDate: { notNull: true, dataType: 'string' },
            shipperId: { notNull: true, dataType: 'number' }
        }
    }

    var products = {
        name: 'Products',
        columns: {
            productId: { primaryKey: true, autoIncrement: true },
            productName: { notNull: true, dataType: 'string' },
            supplierId: { notNull: true, dataType: 'number' },
            categoryId: { notNull: true, dataType: 'number' },
            unit: { notNull: true, dataType: 'string' },
            price: { notNull: true, dataType: 'number' },
        }
    }

    var shippers = {
        name: 'Shippers',
        columns: {
            shipperId: { primaryKey: true, autoIncrement: true },
            shipperName: { notNull: true, dataType: 'string' },
            phone: { notNull: true, dataType: 'string' }
        }
    }

    var suppliers = {
        name: 'Suppliers',
        columns: {
            supplierId: { primaryKey: true, autoIncrement: true },
            supplierName: { notNull: true, dataType: 'string' },
            contactName: { notNull: true, dataType: 'string' },
            address: { notNull: true, dataType: 'string' },
            city: { notNull: true, dataType: 'string' },
            postalCode: { notNull: true, dataType: 'string' },
            country: { notNull: true, dataType: 'string' },
            phone: { notNull: true, dataType: 'string' },
        }
    }

    var things = {
        name: "things",
        columns: {
            value: { dataType: 'string' }
        }
    }

    var dataBase = {
        name: "Demo",
        tables: [categories, customers, categoriesGarbage, employees, orderDetails, orders, products, shippers, suppliers, things]
    };
    return dataBase;
}