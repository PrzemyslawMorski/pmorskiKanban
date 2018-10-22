export interface IRegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface IErrorResponse {
  error: string;
  errorCode: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}
