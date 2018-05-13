export class IStudent {
    id?: number;
    name: string;
    gender: string;
    country: string;
    city: string;
}

export class Student implements IStudent {
    id = 0;
    name = '';
    gender = 'm';
    country = '';
    city = '';
}
