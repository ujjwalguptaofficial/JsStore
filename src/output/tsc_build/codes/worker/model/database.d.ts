import { IDataBase } from "../interfaces";
import { Table } from "./table";
export declare class DataBase {
    name: string;
    tables: Table[];
    constructor(dataBase: IDataBase);
}
