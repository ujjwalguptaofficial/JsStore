function getShopDbSchema() {

    var DATA_TYPE = JsStore.DATA_TYPE;
    var customerTable = {
        name: 'customers',
        columns: {
            id: {
                primaryKey: true,
                autoIncrement: true,
            },
            customerName: {
                notNull: true,
                dataType: 'string'
            }, address: {
                notNull: true,
                dataType: 'string',
            },
            city: {
                notNull: true,
                dataType: 'string'
            }, postalCode: {
                dataType: 'string'
            }, country: {
                notNull: true,
                dataType: 'string'
            },
            email: {
                dataType: 'string',
                enableSearch: false
            }
        }
    };

    var orderDetails = {
        name: 'orderDetails',
        columns: {
            orderDetailId: {
                primaryKey: true,
                autoIncrement: true
            }, orderId: {
                notNull: true,
                dataType: DATA_TYPE.Number
            }, productId: {
                notNull: true,
                dataType: DATA_TYPE.Number
            }, quantity: {
                notNull: true,
                dataType: 'number'
            }
        }
    }

    var orders = {
        name: 'orders',
        columns: {
            orderId: {
                primaryKey: true,
                autoIncrement: true,
            },
            customerId: {
                notNull: true,
                dataType: 'number'
            },
            orderDate: {
                notNull: true,
                dataType: 'date_time'
            }
        }
    }

    var products = {
        name: 'products',
        columns: {
            productId: {
                primaryKey: true,
                autoIncrement: true
            },
            productName: {
                notNull: true,
                dataType: 'string'
            },
            unit: {
                notNull: true,
                dataType: 'number'
            },
            price: {
                notNull: true,
                dataType: 'number'
            }
        }
    }

    var db = {
        name: 'shop',
        tables: [customerTable, orderDetails, orders, products]
    }

    return db;
}