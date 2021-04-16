import { IUser, IArticle } from '.';

export interface ISchemaResult {
  success: boolean;
  message: string;
  result?: IArticle | IUser | string;
}
