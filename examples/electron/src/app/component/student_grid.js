import {
    StudentService
} from "../service/student_service";
import {
    Student
} from "../model/student";
import * as $ from "jquery";

export class StudentGrid {

    getHtml() {
        return `<table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Country</th>
                            <th>City</th>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr>
                            <td><input type="text"/></td>
                            <td><input type="text"/></td>
                            <td><input type="text"/></td>
                            <td><input type="text"/></td>
                            <td><button id="btnAdd">Add</button></td>
                            <td><button id="btnClear">Clear</button></td>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>`
    }

    init() {
        var studentService = new StudentService();
        var html = '';
        studentService.getStudents().then(students => {
            students.forEach((student) => {
                html += this.getRowHtml(student);
            })
            $('table tbody').html(html);
        });
        this.catchEvents();
    }

    getRowHtml(student) {
        const html = `<tr data-id='${student.id}'>
                        <td>${student.name}</td>
                        <td>${student.gender}</td>
                        <td>${student.country}</td>
                        <td>${student.city}</td>
                        <td><button class='btn-edit'>Edit</button></td>
                        <td><button class='btn-delete'>Delete</button></td>
                      </tr>`;
        return html;
    }

    clearAddRowTextBoxValue() {
        $('table thead tr td input').val('');
    }

    catchEvents() {
        $('#btnAdd').click(() => {
            const addRow = $('table thead tr')[1];
            const student = new Student(
                0,
                $(addRow.cells[0]).find('input').val(),
                $(addRow.cells[1]).find('input').val(),
                $(addRow.cells[2]).find('input').val(),
                $(addRow.cells[3]).find('input').val()
            );
            var studentService = new StudentService();
            studentService.addStudent(student).then((addedStudents) => {
                if (addedStudents.length > 0) {
                    this.clearAddRowTextBoxValue();
                    $('table tbody').append(this.getRowHtml(addedStudents[0]));
                }
            }).catch(function (err) {
                alert(err.message);
            })
        });

        $('#btnClear').click(() => {
            this.clearAddRowTextBoxValue();
        });

        $('body').on('click', 'table .btn-delete', function () {
            var row = $(this).parents('tr');
            var studentId = Number(row.data('id'));
            var studentService = new StudentService();
            studentService.removeStudent(studentId).then(function (noOfRowsDeleted) {
                if (noOfRowsDeleted > 0) {
                    row.remove();
                }
            }).catch(function (err) {
                alert(err.message);
            });
        });


        $('body').on('click', 'table .btn-edit', function () {
            var row = $(this).parents('tr');
            row.find('td').each(function () {
                var $el = $(this);
                if ($el.find('button').length === 0) {
                    $el.html(`<input type="text" value="${$el.text()}"/>`);
                }
            });
            row.find('td:eq(4)').html('<button class="btn-update">Update</button>');
            row.find('td:eq(5)').html('<button class="btn-cancel-update">Cancel</button>');
        });

        $('body').on('click', 'table .btn-cancel-update', function () {
            var row = $(this).parents('tr');
            var studentService = new StudentService();
            studentService.getStudentById(Number(row.data('id'))).then(function (students) {
                if (students.length > 0) {
                    const student = students[0];
                    row.find('td:eq(0)').html(student.name);
                    row.find('td:eq(1)').html(student.gender);
                    row.find('td:eq(2)').html(student.country);
                    row.find('td:eq(3)').html(student.city);
                }

            }).catch(function (err) {
                alert(err.message);
            });
            row.find('td:eq(4)').html('<button class="btn-edit">Edit</button>');
            row.find('td:eq(5)').html('<button class="btn-delete">Delete</button>');
        });

        $('body').on('click', 'table .btn-update', function () {
            var row = $(this).parents('tr');
            var student = {
                name: row.find('td:eq(0) input').val(),
                gender: row.find('td:eq(1) input').val(),
                country: row.find('td:eq(2) input').val(),
                city: row.find('td:eq(3) input').val()
            };
            var studentService = new StudentService();
            var studentId = Number(row.data('id'));
            studentService.updateStudentById(studentId, student).then(function (noOfRowsUpdated) {
                if (noOfRowsUpdated > 0) {
                    row.find('td').each(function (index) {
                        var $el = $(this);
                        if ($el.find('button').length === 0) {
                            $el.html(row.find(`td:eq(${index}) input`).val());
                        }
                    });
                    row.find('td:eq(4)').html('<button class="btn-edit">Edit</button>');
                    row.find('td:eq(5)').html('<button class="btn-delete">Delete</button>');
                }
            }).catch(function (err) {
                alert(err.message);
            });
        })
    }

}