interface IName {
    firstName: string;
    middleName: string;
    lastName: string;
}

export interface IProfile {
    name: IName;
    designation: string;
    photo: string;
    description: string;
    about: string;
    phone: string;
    email: string;
    address: string;
    resume: string;
    github: string;
    linkedin: string;
    x: string;
}
