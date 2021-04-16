import { message } from '../../constants/message';
import { TABLE_GROUP } from '../../constants/table_name';
import { DBconnection } from '../../database';
import { ArticleService } from '../../services';
import { ISchemaResult } from '../../types';

const deleteArticleResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

export default {
  Article: {
    created_user: (parent, args, { requestUser }, info) => {
      return requestUser;
    },
    group: ({ group_id }, args, { requestUser }, info) => {
      return group_id
        ? DBconnection(TABLE_GROUP).select('*').where({ group_id }).first()
        : null;
    },
  },
  Query: {
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
  },
};
