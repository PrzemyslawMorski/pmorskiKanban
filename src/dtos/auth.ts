import * as firebase from "firebase";

export interface IRegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface IRegisterResponse {
  user: firebase.User;
}

export interface IErrorResponse {
  error: string;
  errorCode: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  uid: string;
  username: string;
  accessToken: string;
  email: string;
}
