import * as Service from '../service/main';
import * as $ from 'jquery';
export var Business;
(function (Business) {
    var StudentLogic = /** @class */ (function () {
        function StudentLogic() {
            this._service = new Service.Student();
            this._service.createDb();
            this.registerEvents();
        }
        StudentLogic.prototype.registerEvents = function () {
            var _this = this;
            // add button
            $('#divContainer').on('click', 'td .btn-add', function () {
                _this.addStudent();
            });
            // edit button
            $('#divContainer').on('click', 'td .btn-edit', function () {
                console.log('edit clicked');
            });
            // delete button
            $('#divContainer').on('click', 'td .btn-delete', function () {
                var id = $(this).parents('tr').attr('data-id');
                deleteStudent(Number(id));
            });
            var deleteStudent = function (id) {
                this.deleteStudent(id);
            }.bind(this);
        };
        StudentLogic.prototype.getAddRow = function () {
            return "<tr class=\"tr-add\">\n            <td><input type=\"text\"></td>\n            <td><input type=\"text\"></td>\n            <td><input type=\"text\"></td>\n            <td><input type=\"text\"></td>\n            <td><button class=\"btn-add\">Add</button></td>\n            <td><button>Cancel</button></td>\n            </tr>";
        };
        StudentLogic.prototype.deleteStudent = function (studentId) {
            this._service.deleteStudent(studentId).then(function (rowsDeleted) {
                if (rowsDeleted > 0) {
                    var row = $("#tblStudents tbody tr[data-id='" + studentId + "']");
                    row.remove();
                }
            }).catch(function (err) {
                alert(err._message);
            });
        };
        StudentLogic.prototype.addStudent = function () {
            var _this = this;
            var columns = document.querySelectorAll('.tr-add td');
            var student = {
                _name: columns[0].querySelector('input').value,
                _gender: columns[1].querySelector('input').value,
                _country: columns[2].querySelector('input').value,
                _city: columns[3].querySelector('input').value
            };
            this._service.addStudent(student).then(function (rowsAdded) {
                if (rowsAdded > 0) {
                    _this.refreshStudentList();
                    alert('successfully added');
                }
            }).catch(function (err) {
                console.error(err);
                alert(err._message);
            });
        };
        StudentLogic.prototype.clearAddText = function () {
            var columns = document.querySelectorAll('.tr-add td');
            columns.forEach(function (column) {
                column.innerHTML = "";
            });
        };
        StudentLogic.prototype.refreshStudentList = function () {
            var _this = this;
            this._service.getStudents().then(function (results) {
                var table_body = document.querySelector('#tblStudents tbody');
                var html = _this.getAddRow();
                results.forEach(function (student) {
                    html += "<tr data-id=" + student._id + ">\n                    <td>" + student._name + "</td>\n                    <td>" + student._gender + "</td>\n                    <td>" + student._country + "</td>\n                    <td>" + student._city + "</td>\n                    <td><button class=\"btn-edit\">Edit</button></td>\n                    <td><button class=\"btn-delete\">Delete</button></td>\n                    </tr>";
                });
                table_body.innerHTML = html;
            }).catch(function (err) {
                console.error(err);
                alert(err._message);
            });
        };
        return StudentLogic;
    }());
    Business.StudentLogic = StudentLogic;
})(Business || (Business = {}));
//# sourceMappingURL=P:/Users/ujjwal/Documents/projects/JsStore/Example/TypeScript Example/business/student_logic.js.map