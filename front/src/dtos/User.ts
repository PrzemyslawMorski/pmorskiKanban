export interface IRegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface IRegisterBadRequestResponse {
  emailError: string;
  nameError: string;
  passwordError: string;
}
