export interface IUser {
    name?: string;
    email?: string;
    password?: string;
    githubId?: string;
    googleId?: string;
    roles?: string[] | [];
    confirmCode?: string;
}
