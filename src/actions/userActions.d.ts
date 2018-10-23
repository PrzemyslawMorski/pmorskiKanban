import { IUser } from "../entities/IUser";
export declare const userData: (user: IUser | null) => {
    type: "USER_DATA";
    payload: null;
} | {
    type: "USER_DATA";
    payload: IUser;
};
export declare const newUsername: (username: string) => {
    type: "NEW_USER_NAME";
    payload: string;
};
