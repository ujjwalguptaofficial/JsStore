var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Base, connection } from './base';
var Student = /** @class */ (function (_super) {
    __extends(Student, _super);
    function Student() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._dbName = "Ts_Student_Demo";
        return _this;
    }
    /**
     * create database
     *
     * @memberof IdbService
     */
    Student.prototype.createDb = function () {
        var _this = this;
        this.isDbExist(this._dbName).then(function (exist) {
            if (exist) {
                connection.openDb(_this._dbName);
            }
            else {
                connection.createDb(_this.getDatabase());
            }
        }).catch(function (err) {
            console.error(err);
            alert(err._message);
        });
    };
    Student.prototype.getStudents = function () {
        return connection.select({
            From: 'Student'
        });
    };
    Student.prototype.addStudent = function (student) {
        return connection.insert({
            Into: 'Student',
            Values: [student]
        });
    };
    Student.prototype.deleteStudent = function (studentId) {
        return connection.remove({
            From: 'Student',
            Where: {
                _id: studentId
            }
        });
    };
    Student.prototype.getDatabase = function () {
        var tbl_student = {
            Name: 'Student',
            Columns: [
                {
                    Name: '_id',
                    PrimaryKey: true,
                    AutoIncrement: true
                },
                {
                    Name: '_name',
                    NotNull: true,
                    DataType: this.Data_Type.String
                },
                {
                    Name: '_gender',
                    DataType: this.Data_Type.String,
                    Default: 'male'
                },
                {
                    Name: '_country',
                    NotNull: true,
                    DataType: this.Data_Type.String
                },
                {
                    Name: '_city',
                    NotNull: true,
                    DataType: this.Data_Type.String
                }
            ]
        };
        var database = {
            Name: this._dbName,
            Tables: [tbl_student]
        };
        return database;
    };
    return Student;
}(Base));
export { Student };
//# sourceMappingURL=P:/Users/ujjwal/Documents/projects/JsStore/Example/TypeScript Example/service/student.js.map