export interface IRegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface IRegisterBadRequest {
  emailError: string;
  nameError: string;
  passwordError: string;
}
