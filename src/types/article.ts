export interface IArticle {
  article_id: string;
  group_id: string;
  only_me: boolean;
  created_user_id: string;
}

export interface ICreateArticleInput {
  article_nme: string;
  article_content: string;
  group_id: string;
  only_me: boolean;
  created_user_id?: string;
}

export interface IUpdateArticleInput {
  article_contennt?: string;
  article_nme?: string;
  article_id: string;
}
