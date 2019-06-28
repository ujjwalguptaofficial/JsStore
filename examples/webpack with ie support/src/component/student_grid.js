import {
    StudentService
} from "../service/student_service";
import {
    Student
} from "../model/student";
import * as $ from "jquery";
import { initJsStore } from "../service/idb_service";

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

    async init() {
        try {
            initJsStore();
        }
        catch (ex) {
            alert(ex.message);
            return;
        }
        var studentService = new StudentService();
        var html = '';
        try {
            const students = await studentService.getStudents();
            students.forEach((student) => {
                html += this.getRowHtml(student);
            })
            $('table tbody').html(html);
            this.catchEvents();
        } catch (err) {
            console.error(err);
        }

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

    async addStudentIntoDb(student) {
        var studentService = new StudentService();
        try {
            const addedStudents = await studentService.addStudent(student);
            if (addedStudents.length > 0) {
                this.clearAddRowTextBoxValue();
                $('table tbody').append(this.getRowHtml(addedStudents[0]));
            }
        } catch (err) {
            alert(err.message);
        }
    }

    catchEvents() {
        $('#btnAdd').click(() => {
            const addRow = $('table thead tr')[1];
            const student = new Student(
                null,
                $(addRow.cells[0]).find('input').val(),
                $(addRow.cells[1]).find('input').val(),
                $(addRow.cells[2]).find('input').val(),
                $(addRow.cells[3]).find('input').val()
            );
            this.addStudentIntoDb(student);
        });

        $('#btnClear').click(() => {
            this.clearAddRowTextBoxValue();
        });

        $('body').on('click', 'table .btn-delete', async function () {
            var row = $(this).parents('tr');
            var studentId = Number(row.data('id'));
            var studentService = new StudentService();
            try {
                const noOfRowsDeleted = await studentService.removeStudent(studentId);
                if (noOfRowsDeleted > 0) {
                    row.remove();
                }
            } catch (err) {
                alert(err.message);
            }
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

        $('body').on('click', 'table .btn-cancel-update', async function () {
            var row = $(this).parents('tr');
            var studentService = new StudentService();
            try {
                const students = await studentService.getStudentById(Number(row.data('id')));
                if (students.length > 0) {
                    const student = students[0];
                    row.find('td:eq(0)').html(student.name);
                    row.find('td:eq(1)').html(student.gender);
                    row.find('td:eq(2)').html(student.country);
                    row.find('td:eq(3)').html(student.city);
                }
                row.find('td:eq(4)').html('<button class="btn-edit">Edit</button>');
                row.find('td:eq(5)').html('<button class="btn-delete">Delete</button>');
            } catch (err) {
                alert(err.message);
            }
        });

        $('body').on('click', 'table .btn-update', async function () {
            var row = $(this).parents('tr');
            var student = {
                name: row.find('td:eq(0) input').val(),
                gender: row.find('td:eq(1) input').val(),
                country: row.find('td:eq(2) input').val(),
                city: row.find('td:eq(3) input').val()
            };
            var studentService = new StudentService();
            var studentId = Number(row.data('id'));
            try {
                const noOfRowsUpdated = await studentService.updateStudentById(studentId, student);
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
            } catch (err) {
                alert(err.message);
            }

        })
    }

}