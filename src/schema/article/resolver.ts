import { defaultPage } from '../../constants';
import { message } from '../../constants/message';
import { TABLE_GROUP } from '../../constants/table_name';
import { DBconnection } from '../../database';
import { ArticleService, UserService } from '../../services';
import { ISchemaResult } from '../../types';

export default {
  Article: {
    created_user: ({ created_user_id }, args, context, info) => {
      return UserService.findUserById(created_user_id);
    },
    group: ({ group_id }, args, { requestUser }, info) => {
      return group_id
        ? DBconnection(TABLE_GROUP).select('*').where({ group_id }).first()
        : null;
    },
    editable: ({ created_user_id }, args, { requestUser }, info) => {
      return created_user_id === requestUser.user_id;
    },
    bookmarked: ({ article_id }, args, { requestUser }, info) => {
      return ArticleService.isArticleBookmarked(article_id, requestUser);
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
        return {
          totalCount: ArticleService.getUsersAccessibleArticlesCount(
            requestUser.user_id,
          ),
          articles: ArticleService.getUsersAccessibleArticles(
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
    bookmarkedArticles: async (
      parent,
      { group_id, page, sort },
      { requestUser },
      info,
    ) => {
      page = page ? page : defaultPage;
      try {
        return {
          totalCount: ArticleService.getUserBookmarkedArticlesCount(
            requestUser.user_id,
          ),
          articles: ArticleService.getUserBookmarkedArticles(
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
        result.message = error.message ? error.message : message.INTERNAL_ERROR;
      }
      return result;
    },
    bookmarkArticle: async (parent, { articleId }, { requestUser }, info) => {
      const result: ISchemaResult = {
        success: false,
        message: '',
      };
      try {
        const bookmark = await ArticleService.bookmarkArticle(
          articleId,
          requestUser,
        );
        result.success = true;
        // TODO load article by article_id
        result.result = bookmark;
        result.message = message.CREATE_SUCCESS;
      } catch (error) {
        result.message = error.message ? error.message : message.INTERNAL_ERROR;
      }
      return result;
    },
    removeArticleBookmark: async (
      parent,
      { articleId },
      { requestUser },
      info,
    ) => {
      const result: ISchemaResult = {
        success: false,
        message: '',
      };
      try {
        const deletedBookmark = await ArticleService.removeArticleBookmark(
          articleId,
          requestUser,
        );
        result.success = true;
        // TODO load article by article_id
        result.result = deletedBookmark;
        result.message = message.DELETE_SUCCESS;
      } catch (error) {
        result.message = error.message ? error.message : message.INTERNAL_ERROR;
      }
      return result;
    },
  },
};
