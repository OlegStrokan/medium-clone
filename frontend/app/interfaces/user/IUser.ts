export interface IUser {
    id: string;
    fullName: string;
    userName: string;
    email: string;
    activationLink?: string;
    roles?: string[];
    subscriptions?: string[];
}
