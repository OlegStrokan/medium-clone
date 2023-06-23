
export interface IUser {
    id: string;
    fullName: string,
    userName: string,
    email: string;
    activationLink?: { link: string };
    password?: string;
    roles?: string[]
}
