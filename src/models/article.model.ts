import {
  defaultPage,
  defaultSort,
  TABLE_ARTICLE,
  TABLE_USER_IN_GROUP,
} from '../constants';
import { DBconnection } from '../database';
import {
  IOrder,
  IPage,
  ICreateArticleInput,
  IUpdateArticleInput,
} from '../types';

// Query
const getArticleById = (articleId: string) => {
  return DBconnection(TABLE_ARTICLE)
    .select('*')
    .where({ article_id: articleId })
    .first();
};

const getUsersAllArticles = (
  userId: string,
  order: IOrder = defaultSort,
  page: IPage = defaultPage,
) => {
  order = order ? order : defaultSort;
  page = page ? page : defaultPage;
  return DBconnection(TABLE_ARTICLE)
    .select('*')
    .where({ created_user_id: userId })
    .orderBy(order.field, order.order)
    .limit(page.pageCount)
    .offset(page.pageCount * (page.pageNo - 1));
};

const getUsersAllArticlesCount = async (userId: string) => {
  const res = await DBconnection(TABLE_ARTICLE)
    .where({ created_user_id: userId })
    .count();
  return res[0].count;
};

const getUsersAllPublicArticles = (
  userId: string,
  order: IOrder = defaultSort,
  page: IPage = defaultPage,
) => {
  order = order ? order : defaultSort;
  page = page ? page : defaultPage;
  return DBconnection(TABLE_ARTICLE)
    .select('*')
    .where({ created_user_id: userId, only_me: false, group_id: null })
    .orderBy(order.field, order.order)
    .limit(page.pageCount)
    .offset(page.pageCount * (page.pageNo - 1));
};
const getUsersAllPublicArticlesCount = async (userId: string) => {
  const res = await DBconnection(TABLE_ARTICLE)
    .where({ created_user_id: userId, only_me: false, group_id: null })
    .count();
  return res[0].count;
};

const getUsersAccessibleArticles = (
  userId: string,
  order: IOrder = defaultSort,
  page: IPage = defaultPage,
) => {
  order = order ? order : defaultSort;
  page = page ? page : defaultPage;
  return DBconnection.select(`${TABLE_ARTICLE}.*`)
    .from(TABLE_ARTICLE)
    .leftJoin(
      TABLE_USER_IN_GROUP,
      `${TABLE_USER_IN_GROUP}.group_id`,
      `${TABLE_ARTICLE}.group_id`,
    )
    .where(DBconnection.raw(`${TABLE_USER_IN_GROUP}.user_id = '${userId}'`))
    .orWhere(
      DBconnection.raw(`${TABLE_ARTICLE}.group_id IS NULL 
    AND ${TABLE_ARTICLE}.created_user_id = '${userId}'`),
    )
    .orderBy(order.field, order.order)
    .limit(page.pageCount)
    .offset(page.pageCount * (page.pageNo - 1));
};

const getUsersAccessibleArticlesCount = async (userId: string) => {
  const res = await DBconnection.from(TABLE_ARTICLE)
    .leftJoin(
      TABLE_USER_IN_GROUP,
      `${TABLE_USER_IN_GROUP}.group_id`,
      `${TABLE_ARTICLE}.group_id`,
    )
    .where(DBconnection.raw(`${TABLE_USER_IN_GROUP}.user_id = '${userId}'`))
    .orWhere(
      DBconnection.raw(`${TABLE_ARTICLE}.group_id IS NULL 
    AND ${TABLE_ARTICLE}.created_user_id = '${userId}'`),
    )
    .count();
  return res[0].count;
};
const getArticleCountInGroup = async (groupId: string) => {
  const res = await DBconnection(TABLE_ARTICLE)
    .where({ group_id: groupId })
    .count();
  return res[0].count;
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
  getUsersAllArticles,
  getUsersAllArticlesCount,
  getUsersAllPublicArticles,
  getUsersAllPublicArticlesCount,
  getUsersAccessibleArticles,
  getUsersAccessibleArticlesCount,
  getArticleCountInGroup,
  createArticle,
  updateArticle,
  deleteArticle,
};
