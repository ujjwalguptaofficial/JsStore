import * as Service from '../service/main';
import * as Model from '../model/main';
import * as $ from 'jquery';
export namespace Business {
    export class StudentLogic {
        _service = new Service.Student();

        constructor() {
            this._service.createDb();
            this.registerEvents();
        }

        registerEvents() {
            // add button
            $('#divContainer').on('click', 'td .btn-add', () => {
                this.addStudent();
            });
            // edit button
            $('#divContainer').on('click', 'td .btn-edit', () => {
                console.log('edit clicked');
            });
            // delete button
            $('#divContainer').on('click', 'td .btn-delete', function () {
                var id = $(this).parents('tr').attr('data-id');
                deleteStudent(Number(id));
            });

            var deleteStudent = function (id: number) {
                this.deleteStudent(id);
            }.bind(this);

        }

        getAddRow() {
            return `<tr class="tr-add">
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><button class="btn-add">Add</button></td>
            <td><button>Cancel</button></td>
            </tr>`;
        }

        deleteStudent(studentId) {
            this._service.deleteStudent(studentId).then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    var row = $("#tblStudents tbody tr[data-id='" + studentId + "']");
                    row.remove();
                }
            }).catch(err => {
                alert(err._message);
            });
        }

        addStudent() {
            var columns = document.querySelectorAll('.tr-add td');
            var student: Model.Student = {
                _name: columns[0].querySelector('input').value,
                _gender: columns[1].querySelector('input').value,
                _country: columns[2].querySelector('input').value,
                _city: columns[3].querySelector('input').value
            };
            this._service.addStudent(student).then((rowsAdded) => {
                if (rowsAdded > 0) {
                    this.refreshStudentList();
                    alert('successfully added');
                }
            }).catch((err) => {
                console.error(err);
                alert(err._message);
            });
        }

        clearAddText() {
            var columns = document.querySelectorAll('.tr-add td');
            (columns as any).forEach(column => {
                column.innerHTML = "";
            });
        }

        refreshStudentList() {
            this._service.getStudents().then((results: Model.Student[]) => {
                var table_body = document.querySelector('#tblStudents tbody');
                var html = this.getAddRow();
                results.forEach(student => {
                    html += `<tr data-id=${student._id}>
                    <td>${student._name}</td>
                    <td>${student._gender}</td>
                    <td>${student._country}</td>
                    <td>${student._city}</td>
                    <td><button class="btn-edit">Edit</button></td>
                    <td><button class="btn-delete">Delete</button></td>
                    </tr>`;
                });
                table_body.innerHTML = html;

            }).catch((err) => {
                console.error(err);
                alert(err._message);
            });
        }
    }
}