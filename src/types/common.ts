import { IArticle } from './article';

export interface ISchemaResult {
  success: boolean;
  message: string;
  result?: IArticle;
}
