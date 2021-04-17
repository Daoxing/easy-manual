export interface IRequestingUser {
  user_id: string;
  user_nme: string;
  email_address: string;
}

export interface IUser {
  user_id: string;
  user_nme: string;
  email_address: string;
}

export enum GenderEnum {
  Male = 'MALE',
  Female = 'FEMALE',
  Unknown = 'UNKNOWN',
}

export interface SearchUsersByNameInput {
  name: string;
  group_id?: string;
}

export interface LoginByEmail {
  email_address: string;
}
export interface LoginByPhoneNbr {
  phone_nbr: string;
}

export interface NewUser {
  email_address?: string;
  phone_nbr?: string;
  verify_code: string;
  verify_code_created_tms: Date;
}

export interface UpdateUserInfo {
  email_address?: string;
  phone_nbr?: string;
  user_nme?: string;
}
