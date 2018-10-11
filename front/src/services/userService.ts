import {from, Observable} from "rxjs";
import {ILoginRequest, IRegisterRequest} from "../dtos/User";
import {baseUrl, loginEndpoint, registerEndpoint} from "./constants";

export const registerHttpCall = (registerRequestDto: IRegisterRequest): Observable<Response> => {
  return from(fetch(baseUrl + registerEndpoint, {
    body: JSON.stringify(registerRequestDto),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  }));
};

export const loginHttpCall = (loginRequestDto: ILoginRequest): Observable<Response> => {
  return from(fetch(baseUrl + loginEndpoint, {
    body: JSON.stringify(loginRequestDto),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  }));
};
