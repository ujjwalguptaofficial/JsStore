importScripts('/output/jsstore.js');
importScripts('/output/jsstore.worker.js');

self.addEventListener('fetch', function (event) {
    console.log("fetch event:", event.request.url);
});

var dbName = "ServiceWorkerDemo";

function initDb() {
    var connection = new JsStore.Connection();
    return connection.initDb(getDbSchema()).then(function(isDbCreated){
        if (isDbCreated) {
            console.log('db created');
        }
        else {
            console.log('db opened');
        }
        return connection;
    })
}

function getDbSchema() {
    var table = {
        name: 'Student',
        columns: {
            id: {
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                notNull: true,
                dataType: 'string'
            },
            gender: {
                dataType: 'string',
                default: 'male'
            },
            country: {
                notNull: true,
                dataType: 'string'
            },
            city: {
                dataType: 'string',
                notNull: true
            }
        }
    }

    var db = {
        name: dbName,
        tables: [table]
    }
    return db;
}

// throw "ss"

self.addEventListener('install', (event) => {
    const promiseChain = caches.open('test-cache')
        .then((openCache) => {
            initDb().then(function (connection) {
                return connection.terminate();
            }).then(() => {                
                return openCache.put(
                    new Request('/__test/example'),
                    new Response('Hello, World!')
                );
            })
        });
    event.waitUntil(promiseChain);
});