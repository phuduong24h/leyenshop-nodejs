export interface ISignUp {
  fullName: string;
  phone: string;
  address: string;
  password: string;
}

export interface IForgotPassword {
  phone: string;
}

export interface IVerifyCode {
  phone: string;
  code: string;
}

export interface IResetPassword {
  phone: string;
  code: string;
  newPassword: string;
}
