

var jsstoreCon = new JsStore.Instance(new Worker("scripts/jsstore.worker.min.js"));

window.onload = function () {
    refreshTableData();
    registerEvents();
    initDb();
};

function initDb() {
    var dbName = "My-Db";
    jsstoreCon.isDbExist(dbName).then(function (isExist) {
        if (isExist) {
            jsstoreCon.openDb(dbName).then(function () {
                console.log('opened');
            })
        }
        else {
            jsstoreCon.createDb(getDbSchema()).then(function () {
                console.log('created');
            })
        }
    })
}

function getDbSchema() {
    var table = {
        name: 'Student',
        columns: [{
            name: 'id',
            autoIncrement: true,
            primaryKey: true
        }, {
            name: 'name',
            dataType: 'string'
        }, {
            name: 'gender'
        }, {
            name: 'country'
        }, {
            name: 'city'
        }]
    }

    var db = {
        name: 'My-Db',
        tables: [table]
    }
    return db;
}

function registerEvents() {
    $('#btnAddStudent').click(function () {
        showFormAndHideGrid();
    })
    $('#tblGrid tbody').on('click', '.edit', function () {
        var row = $(this).parents().eq(1);
        var child = row.children();
        var student = {
            id: row.attr('itemid'),
            name: child.eq(0).text(),
            gender: child.eq(1).text(),
            country: child.eq(2).text(),
            city: child.eq(3).text()
        }
        refreshFormData(student);
        showFormAndHideGrid();
    });
    $('#tblGrid tbody').on('click', '.delete', function () {
        var result = confirm('Are you sure, you want to delete?');
        if (result) {
            var studentId = $(this).parents().eq(1).attr('itemid');
            deleteStudent(studentId);
        }
    });
    $('#btnSubmit').click(function () {
        var studentId = $('form').attr('data-student-id');
        if (studentId) {
            updateStudent();
        }
        else {
            addStudent();
        }
    });
}


//This function refreshes the table
function refreshTableData() {
    var htmlString = "";
    jsstoreCon.select({
        from: 'Student'
    }).then(function (students) {
        students.forEach(function (student) {
            htmlString += "<tr ItemId=" + student.id + "><td>" +
                student.name + "</td><td>" +
                student.gender + "</td><td>" +
                student.country + "</td><td>" +
                student.city + "</td><td>" +
                "<a href='#' class='edit'>Edit</a></td>" +
                "<td><a href='#' class='delete''>Delete</a></td>";
        })
        $('#tblGrid tbody').html(htmlString);
    }).catch(function (err) {
        console.error(err);
    })

}



function addStudent() {
    var student = getStudentFromForm();
    insertDataIntoDb(student).then(function (noOfDataInserted) {
        if (noOfDataInserted === 1) {
            refreshTableData();
            showGridAndHideForm();
        }
    }).catch(function (err) {
        console.error(err);
    })


}

function updateStudent() {
    var student = getStudentFromForm();
    jsstoreCon.update({
        in: 'Student',
        set: {
            name: student.name,
            gender: student.gender,
            country: student.country,
            city: student.city
        }
    }).then(function (noOfDataUpdated) {
        console.log(`data updated ${noOfDataUpdated}`);
        showGridAndHideForm();
        $('form').attr('data-student-id', null);
        refreshTableData();
        refreshFormData({});
    }).catch(function (err) {
        console.error(err);
    })


}

function deleteStudent(id) {
    var index = students.findIndex(qry => qry.id == id);
    if (index >= 0) {
        students.splice(index, 1);
        refreshTableData();
    }
}
function getStudentFromForm() {
    var student = {
        id: Number($('form').attr('data-student-id')),
        name: $('#txtName').val(),
        gender: $("input[name='gender']:checked").val(),
        country: $('#txtCountry').val(),
        city: $('#txtCity').val()
    };
    return student;
}

function showFormAndHideGrid() {
    $('#formAddUpdate').show();
    $('#tblGrid').hide();
}

function showGridAndHideForm() {

    $('#formAddUpdate').hide();
    $('#tblGrid').show();
}

function refreshFormData(student) {
    $('form').attr('data-student-id', student.id);
    $('#txtName').val(student.name);
    $(`input[name='gender'][value=${student.gender}]`).prop('checked', true);
    $('#txtCountry').val(student.country);
    $('#txtCity').val(student.city);
}

function insertDataIntoDb(student) {
    return jsstoreCon.insert({
        into: 'Student',
        values: [student]
    })
}