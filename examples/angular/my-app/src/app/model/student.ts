export class IStudent {
    id?: number;
    name: string;
    gender: string;
    country: string;
    city: string;
}

export class Student implements IStudent {
    id = null;
    name = '';
    gender = 'm';
    country = '';
    city = '';
}
