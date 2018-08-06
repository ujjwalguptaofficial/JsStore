This is a demo project. It demonstrate how to change table schema in indexeddb using jsstore.

Note :- Please read jsstore docs for changing table schema - [Change table schema](http://jsstore.net/tutorial/change-table-design/) before using this project.

* By default it creates the Database (the default code is in init_db.js). 
* Code for changing table schema is in - change_table-schema.js .
* For changing the table schema - comment the line which includes the script init_db.js and uncomment the line which include the script change_table_schema.js. Now refresh the browser, you will see a new column address is created.
* Please take a look at both scripts - init_db.js, change_table_schema.js and compare what is changed, so that you have an idea of how things are working.

### It is just a demo application. It does not cover good coding practice or other things. You can write your own logic with some good coding practice.