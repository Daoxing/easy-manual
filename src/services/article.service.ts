import validator from 'validator';
import { message } from '../constants';
import { specialRegex } from '../constants/common';
import { ArticleModel, UserModel } from '../models';
import { GroupModel } from '../models/group.model';
import {
  IArticle,
  ICreateArticleInput,
  IOrder,
  IPage,
  IRequestingUser,
  IUpdateArticleInput,
} from '../types';

// Query
const getArticleById = async (
  articleId: string,
  requestingUser: IRequestingUser,
) => {
  const article: IArticle = await ArticleModel.getArticleById(articleId);
  if (!article) {
    throw new Error(message.NOT_FOUND_ARTICLE);
  }
  if (article.only_me && article.created_user_id !== requestingUser.user_id) {
    throw new Error(message.NOT_FOUND_ARTICLE);
  }
  if (article.group_id) {
    const user = await UserModel.getUserInGroup(
      requestingUser.user_id,
      article.group_id,
    );
    if (!user) {
      throw new Error(message.NO_PERMISSION);
    }
  }
  return article;
};

const getUsersAllArticles = (userId: string, sort: IOrder, page: IPage) => {
  return ArticleModel.getUsersAllArticles(userId, sort, page);
};
const getUsersAllArticlesCount = (userId: string) => {
  return ArticleModel.getUsersAllArticlesCount(userId);
};

const getUsersAllPublicArticles = (
  userId: string,
  sort: IOrder,
  page: IPage,
) => {
  return ArticleModel.getUsersAllPublicArticles(userId, sort, page);
};
const getUsersAllPublicArticlesCount = (userId: string) => {
  return ArticleModel.getUsersAllPublicArticlesCount(userId);
};

const getUsersAccessibleArticles = async (
  userId: string,
  sort: IOrder,
  page: IPage,
) => {
  return ArticleModel.getUsersAccessibleArticles(userId, sort, page);
};
const getUsersAccessibleArticlesCount = (userId: string) => {
  return ArticleModel.getUsersAccessibleArticlesCount(userId);
};
const getArticlesInGroup = (
  groupId: string,
  requestingUserId: string,
  sort: IOrder,
  page: IPage,
) => {
  return ArticleModel.getArticlesInGroup(groupId, requestingUserId, sort, page);
};
const getArticlesCountInGroup = (groupId: string, requestingUserId: string) => {
  return ArticleModel.getArticlesCountInGroup(groupId, requestingUserId);
};
// Create
const createArticle = async (
  articleInfo: ICreateArticleInput,
  requestingUser: IRequestingUser,
) => {
  let { article_nme, group_id, article_content, only_me } = articleInfo;
  article_nme = article_nme.replace(specialRegex, '');
  if (article_nme.length === 0) {
    throw new Error(message.INVALID_INPUT);
  }
  if (group_id && validator.isUUID(group_id)) {
    const findGroup = await GroupModel.getGroupById(group_id);
    if (!findGroup) {
      throw new Error(message.NOT_FOUND_GROUP);
    }
  } else {
    group_id = null;
  }
  only_me = !!only_me;

  const createResult = await ArticleModel.createArticle({
    article_nme,
    group_id,
    created_user_id: requestingUser.user_id,
    article_content,
    only_me,
  });
  if (!createResult) {
    throw new Error(message.CREATE_FAIL);
  }
  return createResult[0];
};

// Update
const updateArticle = async (
  articleInfo: IUpdateArticleInput,
  requestingUser: IRequestingUser,
) => {
  let { article_nme, article_id } = articleInfo;

  if (article_nme) {
    articleInfo.article_nme = article_nme.replace(specialRegex, '');
  }
  if (!article_id || !validator.isUUID(article_id, '4')) {
    throw new Error(message.INVALID_INPUT);
  }

  const foundArticle = await ArticleModel.getArticleById(article_id);
  if (!foundArticle) {
    throw new Error(message.NOT_FOUND_ARTICLE);
  }

  if (foundArticle.created_user_id !== requestingUser.user_id) {
    throw new Error(message.NO_PERMISSION);
  }

  const updateResult = await ArticleModel.updateArticle(articleInfo);

  if (!updateResult) {
    throw new Error(message.UPDATE_FAIL);
  }
  return updateResult[0];
};

// Delete
const deleteArticle = async (
  articleId: string,
  requestingUser: IRequestingUser,
) => {
  const foundArticle = await ArticleModel.getArticleById(articleId);
  if (!foundArticle) {
    throw new Error(message.NOT_FOUND_ARTICLE);
  }
  if (foundArticle.created_user_id !== requestingUser.user_id) {
    throw new Error(message.NO_PERMISSION);
  }
  const deleteArticle = await ArticleModel.deleteArticle(articleId);
  if (!deleteArticle) {
    throw new Error(message.DELETE_FAIL);
  }
  return deleteArticle;
};

// Bookmark
const bookmarkArticle = async (
  articleId: string,
  requestingUser: IRequestingUser,
) => {
  const foundArticle = await ArticleModel.getArticleById(articleId);
  if (!foundArticle) {
    throw new Error(message.NOT_FOUND_ARTICLE);
  }

  const bookmark = await ArticleModel.bookmarkArticle(
    articleId,
    requestingUser.user_id,
  );
  if (!bookmark) {
    throw new Error(message.CREATE_FAIL);
  }
  return bookmark;
};

const removeArticleBookmark = async (
  articleId: string,
  requestingUser: IRequestingUser,
) => {
  const foundArticle = await ArticleModel.getArticleById(articleId);
  if (!foundArticle) {
    throw new Error(message.NOT_FOUND_ARTICLE);
  }
  const deletedBookmark = await ArticleModel.removeArticleBookmark(
    articleId,
    requestingUser.user_id,
  );
  if (!deletedBookmark) {
    throw new Error(message.DELETE_FAIL);
  }
  return deletedBookmark;
};

const isArticleBookmarked = async (
  articleId: string,
  requestingUser: IRequestingUser,
) => {
  return ArticleModel.isArticleBookmarked(articleId, requestingUser.user_id);
};

const getUserBookmarkedArticlesCount = (userId: string) => {
  return ArticleModel.getUserBookmarkedArticlesCount(userId);
};

const getUserBookmarkedArticles = async (
  userId: string,
  sort: IOrder,
  page: IPage,
) => {
  return ArticleModel.getUserBookmarkedArticles(userId, sort, page);
};

export const ArticleService: any = {
  getArticleById,
  getUsersAllArticles,
  getUsersAllArticlesCount,
  getUsersAllPublicArticles,
  getUsersAllPublicArticlesCount,
  getUsersAccessibleArticles,
  getUsersAccessibleArticlesCount,
  getArticlesCountInGroup,
  getArticlesInGroup,
  createArticle,
  updateArticle,
  deleteArticle,
  bookmarkArticle,
  removeArticleBookmark,
  isArticleBookmarked,
  getUserBookmarkedArticlesCount,
  getUserBookmarkedArticles,
};
