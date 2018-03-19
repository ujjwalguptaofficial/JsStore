import { ITableOption, IDataBaseOption, IError } from 'jsstore';
import { Base, connection } from './base';
import * as Model from '../model/main';

export class Student extends Base {
    _dbName = "Ts_Student_Demo";

    /**
     * create database
     * 
     * @memberof IdbService
     */
    createDb() {
        this.isDbExist(this._dbName).then((exist: boolean) => {
            if (exist) {
                connection.openDb(this._dbName);
            }
            else {
                connection.createDb(this.getDatabase());
            }
        }).catch((err: IError) => {
            console.error(err);
            alert(err._message);
        });
    }

    getStudents() {
        return connection.select({
            From: 'Student'
        });
    }

    addStudent(student: Model.Student) {
        return connection.insert({
            Into: 'Student',
            Values: [student]
        });
    }

    deleteStudent(studentId: number) {
        return connection.remove({
            From: 'Student',
            Where: {
                _id: studentId
            }
        });
    }

    getStudent(studentId: number) {
        return connection.select({
            From: 'Student',
            Where: {
                _id: studentId
            }
        });
    }

    updateStudent(studentId: number, value) {
        return connection.update({
            In: 'Student',
            Set: value,
            Where: {
                _id: studentId
            }
        });
    }

    private getDatabase() {
        const tbl_student: ITableOption = {
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
        const database: IDataBaseOption = {
            Name: this._dbName,
            Tables: [tbl_student]
        };

        return database;
    }
}