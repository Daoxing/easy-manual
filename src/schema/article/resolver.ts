import { defaultPage } from '../../constants';
import { message } from '../../constants/message';
import { TABLE_GROUP } from '../../constants/table_name';
import { DBconnection } from '../../database';
import { ArticleService, UserService } from '../../services';
import { ISchemaResult } from '../../types';

export default {
  Article: {
    created_user: (parent, args, { requestUser }, info) => {
      return UserService.me(requestUser);
    },
    group: ({ group_id }, args, { requestUser }, info) => {
      return group_id
        ? DBconnection(TABLE_GROUP).select('*').where({ group_id }).first()
        : null;
    },
    editable: ({ created_user_id }, args, { requestUser }, info) => {
      return created_user_id === requestUser.user_id;
    },
  },
  Query: {
    getUsersAllArticles: async (
      parent,
      { page, sort },
      { requestUser },
      info,
    ) => {
      page = page ? page : defaultPage;
      try {
        return {
          totalCount: ArticleService.getUsersAllArticlesCount(
            requestUser.user_id,
          ),
          articles: ArticleService.getUsersAllArticles(
            requestUser.user_id,
            sort,
            page,
          ),
          page,
        };
      } catch (error) {}
      return {
        totalCount: 0,
        articles: [],
        page,
      };
    },
    getUsersAllPublicArticles: async (
      parent,
      { page, sort },
      { requestUser },
      info,
    ) => {
      page = page ? page : defaultPage;
      try {
        return {
          totalCount: ArticleService.getUsersAllPublicArticlesCount(
            requestUser.user_id,
          ),
          articles: ArticleService.getUsersAllPublicArticles(
            requestUser.user_id,
            sort,
            page,
          ),
          page,
        };
      } catch (error) {}
      return {
        totalCount: 0,
        articles: [],
        page,
      };
    },
    getUsersAccessibleArticles: async (
      parent,
      { page, sort },
      { requestUser },
      info,
    ) => {
      page = page ? page : defaultPage;
      try {
        const articles = await ArticleService.getUsersAccessibleArticles(
          requestUser.user_id,
          sort,
          page,
        );
        return {
          totalCount: ArticleService.getUsersAccessibleArticlesCount(
            requestUser.user_id,
          ),
          articles: articles,
          page,
        };
      } catch (error) {}
      return {
        totalCount: 0,
        articles: [],
        page,
      };
    },
    getArticlesInGroup: async (
      parent,
      { group_id, page, sort },
      { requestUser },
      info,
    ) => {
      page = page ? page : defaultPage;
      try {
        return {
          totalCount: ArticleService.getArticlesCountInGroup(
            group_id,
            requestUser.user_id,
          ),
          articles: ArticleService.getArticlesInGroup(
            group_id,
            requestUser.user_id,

            sort,
            page,
          ),
          page,
        };
      } catch (error) {}
      return {
        totalCount: 0,
        articles: [],
        page,
      };
    },
    getArticle: async (parent, { articleId }, { requestUser }, info) => {
      const result: ISchemaResult = {
        success: false,
        message: '',
      };
      try {
        const article = await ArticleService.getArticleById(
          articleId,
          requestUser,
        );
        result.success = true;
        result.result = article;
      } catch (error) {
        result.message = error.message ? error.message : message.INTERNAL_ERROR;
      }
      return result;
    },
  },
  Mutation: {
    createArticle: async (parent, { articleInfo }, { requestUser }, info) => {
      const result: ISchemaResult = {
        success: false,
        message: '',
      };
      try {
        const createdArticle = await ArticleService.createArticle(
          articleInfo,
          requestUser,
        );
        result.success = true;
        result.result = createdArticle;
        result.message = message.CREATE_SUCCESS;
      } catch (error) {
        result.message = error.message ? error.message : message.INTERNAL_ERROR;
      }
      return result;
    },
    updateArticle: async (parent, { articleInfo }, { requestUser }, info) => {
      const result: ISchemaResult = {
        success: false,
        message: '',
      };
      try {
        const updatedArticle = await ArticleService.updateArticle(
          articleInfo,
          requestUser,
        );
        result.success = true;
        result.result = updatedArticle;
        result.message = message.UPDATE_SUCCESS;
      } catch (error) {
        result.message = error.message ? error.message : message.INTERNAL_ERROR;
      }
      return result;
    },
    deleteArticle: async (parent, { articleId }, { requestUser }, info) => {
      const result: ISchemaResult = {
        success: false,
        message: '',
      };
      try {
        const deletedArticle = await ArticleService.deleteArticle(
          articleId,
          requestUser,
        );
        result.success = true;
        result.result = deletedArticle;
        result.message = message.DELETE_SUCCESS;
      } catch (error) {
        console.log('-------->', error);
        result.message = error.message ? error.message : message.INTERNAL_ERROR;
      }
      return result;
    },
  },
};
