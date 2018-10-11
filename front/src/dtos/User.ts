export interface IRegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginSuccessResponse {
  userId: number;
  userEmail: string;
  userName: string;
  token: string;
}

export interface IRegisterBadRequestResponse {
  emailError: string;
  nameError: string;
  passwordError: string;
}

export interface ILoginBadRequestResponse {
  emailError: string;
  passwordError: string;
  credentialsError: string;
}
