import { Observable } from "rxjs";
import { IErrorResponse, ILoginRequest, ILoginResponse, IRegisterRequest, IRegisterResponse } from "../dtos/auth";
export declare const registerUser: (request: IRegisterRequest) => Observable<IRegisterResponse>;
export declare const loginUser: (request: ILoginRequest) => Observable<ILoginResponse>;
export declare const forgotPassword: (email: string) => Observable<IErrorResponse | null>;
export declare const logoutUser: () => Observable<IErrorResponse | null>;
