export interface IRequestingUser {
  user_id: string;
  user_nme: string;
  email_address: string;
}

export enum GenderEnum {
  Male = 'MALE',
  Female = 'FEMALE',
  Unknown = 'UNKNOWN',
}
