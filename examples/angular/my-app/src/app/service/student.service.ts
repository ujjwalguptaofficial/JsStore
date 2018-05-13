import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ITable, DATA_TYPE, IDataBase } from 'jsstore';
import { IStudent } from '../model/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService extends BaseService {
  dbname = 'Angular_Demo';

  constructor() {
    super();
    this.connection.isDbExist(this.dbname).then(isExist => {
      if (isExist) {
        this.connection.openDb(this.dbname);
      } else {
        const dataBase = this.getDatabase();
        this.connection.createDb(dataBase);
      }
    }).catch(err => {
      // this will be fired when indexedDB is not supported.
      alert(err.message);
    });
  }

  getStudents() {
    return this.connection.select<IStudent>({
      from: 'Students'
    });
  }

  addStudent(student: IStudent) {
    return this.connection.insert<IStudent>({
      into: 'Students',
      return: true, // as id is autoincrement, so we would like to get the inserted value
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

  updateStudent(studentId: number, updateValue: IStudent) {
    return this.connection.update({
      in: 'Students',
      where: {
        id: studentId
      },
      set: updateValue
    });
  }

  getStudent(studentId: number) {
    return this.connection.select<IStudent>({
      from: 'Students',
      where: {
        id: studentId
      }
    });
  }

  private getDatabase() {
    const tblStudent: ITable = {
      name: 'Students',
      columns: [{
        name: 'id',
        primaryKey: true,
        autoIncrement: true
      },
      {
        name: 'name',
        notNull: true,
        dataType: DATA_TYPE.String
      },
      {
        name: 'gender',
        dataType: DATA_TYPE.String,
        default: 'male'
      },
      {
        name: 'country',
        notNull: true,
        dataType: DATA_TYPE.String
      },
      {
        name: 'city',
        dataType: DATA_TYPE.String,
        notNull: true
      }
      ]
    };
    const dataBase: IDataBase = {
      name: this.dbname,
      tables: [tblStudent]
    };
    return dataBase;
  }

}
