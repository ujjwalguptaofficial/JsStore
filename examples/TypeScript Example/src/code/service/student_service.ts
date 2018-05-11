import { BaseService } from './base_service';
import { IError, ITable, Column, COL_OPTION, DATA_TYPE, IDataBase } from 'jsstore';
import { Student } from '../model/student';

export class StudentService extends BaseService {
    private dbName_ = "Ts_Student_Demo";

    /**
     * create database
     * 
     * @memberof IdbService
     */
    createDb() {
        this.connection.isDbExist(this.dbName_).then((exist: boolean) => {
            if (exist) {
                this.connection.openDb(this.dbName_);
            }
            else {
                this.connection.createDb(this.getDatabase_());
            }
        }).catch((err: IError) => {
            console.error(err);
        });
    }

    getStudents() {
        return this.connection.select<Student>({
            from: 'Students'
        });
    }

    addStudent(student: Student) {
        return this.connection.insert({
            into: 'Students',
            values: [student]
        });
    }

    deleteStudent(studentId: number) {
        return this.connection.remove({
            from: 'Students',
            where: {
                id: studentId
            }
        });
    }

    getStudent(studentId: number) {
        return this.connection.select<Student>({
            from: 'Students',
            where: {
                id: studentId
            }
        });
    }

    updateStudent(studentId: number, value) {
        return this.connection.update({
            in: 'Students',
            set: value,
            where: {
                id: studentId
            }
        });
    }

    private getDatabase_() {
        const tblStudent: ITable = {
            name: 'Students',
            columns: [
                new Column('id').options([COL_OPTION.PrimaryKey, COL_OPTION.AutoIncrement]),
                new Column('name').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.String),
                new Column('gender').options([COL_OPTION.NotNull]).disableSearch(),
                new Column('country').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.String),
                new Column('city').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.String)
            ]
        };
        const database: IDataBase = {
            name: this.dbName_,
            tables: [tblStudent]
        };

        return database;
    }
}