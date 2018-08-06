var connection = new JsStore.Instance(new Worker('scripts/jsstore.worker.js')),
    StudentId;
window.onload = function () {
    initiateDb();
    getStudent();
};

function initiateDb() {
    var DbName = "Students";
    connection.isDbExist(DbName).then(function (isExist) {
        if (isExist) {
            connection.openDb(DbName);
        } else {
            window.location.href = "index.html";
        }
    }).catch(function (err) {
        console.log(err);
        alert(err.message);
    });
}

function getStudent() {
    StudentId = getQsValueByName('id');
    //check if Query string param exist
    if (StudentId) {
        connection.select({
            from: 'Student',
            where: {
                Id: Number(StudentId)
            }
        }).then(function (results) {
            if (results.length > 0) {
                var Student = results[0];
                $('#txtName').val(Student.Name);
                $("input[name='Gender'][value=" + Student.Gender + "]").prop('checked', true);
                $('#txtCountry').val(Student.Country);
                $('#txtCity').val(Student.City)
            } else {
                alert('Invalid student id');
            }

        }).catch(function (err) {
            console.log(err);
            alert(err.message);
        })
    }
}

function Submit() {
    //if student exist means we have to update data
    if (StudentId) {
        updateStudent()
    } else {
        addStudent();
    }
}

function updateStudent() {
    var Value = {
        Name: $('#txtName').val(),
        Gender: $("input[name='Gender']:checked").val(),
        Country: $('#txtCountry').val(),
        City: $('#txtCity').val()
    };
    connection.update({ in: 'Student',
        set: Value,
        where: {
            Id: Number(StudentId)
        }
    }).then(function (rowsAffected) {
        alert(rowsAffected + " record Updated");
        if (rowsAffected > 0) {
            window.location.href = "index.html";
        }
    }).catch(function (err) {
        console.log(err);
        alert(err.message);
    })
}

function addStudent() {
    var Value = {
        Name: $('#txtName').val(),
        Gender: $("input[name='Gender']:checked").val(),
        Country: $('#txtCountry').val(),
        City: $('#txtCity').val()
    };

    connection.insert({
        into: "Student",
        values: [Value]
    }).then(function (rowsAdded) {
        alert(rowsAdded + " record Added");
        window.location.href = "index.html";
    }).catch(function (err) {
        console.log(err);
        alert(err.message);
    })

}

function getQsValueByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}