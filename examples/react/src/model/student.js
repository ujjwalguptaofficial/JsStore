
export class Student {
    id;
    name;
    gender;
    country;
    city;

    constructor(id, name, gender, country, city) {
        this.id = id == null ? 0 : id;
        this.name = name == null ? "" : name;
        this.gender = gender == null ? "" : gender;
        this.country = country == null ? "" : country;
        this.city = city == null ? "" : city;
    }
}