import { IUser } from "../entities/User";
export declare const userLoggedIn: (value: IUser) => {
    type: "USER_LOGGED_IN";
    payload: IUser;
};
