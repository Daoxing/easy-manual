import { TABLE_ARTICLE } from '../constants';
import { DBconnection } from '../database';
import { ICreateArticleInput, IUpdateArticleInput } from '../types';

// Query
const getArticleById = (articleId: string) => {
  return DBconnection(TABLE_ARTICLE)
    .select('*')
    .where({ article_id: articleId })
    .first();
};

// Create
const createArticle = (articleInfo: ICreateArticleInput) => {
  return DBconnection(TABLE_ARTICLE).insert(articleInfo).returning('*');
};

// Update
const updateArticle = (articleInfo: IUpdateArticleInput) => {
  const { article_id, ...updateArticleFields } = articleInfo;
  return DBconnection(TABLE_ARTICLE)
    .where({ article_id })
    .update(updateArticleFields)
    .returning('*');
};

// Delete
const deleteArticle = (articleId: string) => {
  return DBconnection(TABLE_ARTICLE)
    .delete()
    .where({ article_id: articleId })
    .first();
};

export const ArticleModel = {
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
