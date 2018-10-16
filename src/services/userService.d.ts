import { Observable } from "rxjs";
import { ILoginRequest, IRegisterRequest } from "../dtos/User";
export declare const registerHttpCall: (registerRequestDto: IRegisterRequest) => Observable<Response>;
export declare const loginHttpCall: (loginRequestDto: ILoginRequest) => Observable<Response>;
