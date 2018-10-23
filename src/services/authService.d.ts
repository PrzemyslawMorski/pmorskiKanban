import { Observable } from "rxjs";
import { ILoginRequest, IRegisterRequest } from "../dtos/auth";
import { IUser } from "../entities/IUser";
export declare const registerUser: (request: IRegisterRequest) => Observable<IUser>;
export declare const loginUser: (request: ILoginRequest) => Observable<void>;
export declare const forgotPassword: (email: string) => Observable<void>;
export declare const logoutUser: () => Observable<void>;
export declare const changeUserName: (newName: string) => Observable<void>;
