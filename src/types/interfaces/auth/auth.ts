export type IRules = {
  required?: string | boolean;
};

export type IRegisterForm = {
  userName: string,
  email: string,
  password: string,
  confirmPassword: string
}

export type ILoginForm = {
  userName: string,
  password: string,
}

export type IPrivateRoom = {
  roomCode: string
}

export interface DropdownTypes {
  keyName: string | number | undefined;
  keyValue: string | number | undefined;
}