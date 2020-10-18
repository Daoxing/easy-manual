import validator from 'validator';
import { specialRegex } from '../../constants/common';
import { message } from '../../constants/message';
import {
  TABLE_ARTICLE,
  TABLE_GROUP,
  TABLE_USER_IN_GROUP,
} from '../../constants/table_name';
import { DBconnection } from '../../database';

const getArticleResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

const createArticleResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

const updateArticleResult = {
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
    getArticle: async (
      parent,
      { articleId: article_id },
      { requestUser },
      info,
    ) => {
      const article = await DBconnection(TABLE_ARTICLE)
        .select('*')
        .where({ article_id })
        .first();
      if (!article) {
        return getArticleResult;
      }
      if (article.only_me && article.created_user_id !== requestUser.user_id) {
        getArticleResult.message = message.NO_PERMISSION;
        return getArticleResult;
      }
      if (article.group_id) {
        const user = await DBconnection(TABLE_USER_IN_GROUP)
          .select('*')
          .where({ group_id: article.group_id, user_id: requestUser.user_id })
          .first();
        if (!user) {
          getArticleResult.message = message.NO_PERMISSION;
          return getArticleResult;
        }
      }
      getArticleResult.result = article;
      getArticleResult.success = true;
      getArticleResult.message = message.SUCCESS;
      return getArticleResult;
    },
  },
  Mutation: {
    createArticle: async (parent, { articleInfo }, { requestUser }, info) => {
      let { article_nme, group_id, only_me } = articleInfo;
      article_nme = article_nme.replace(specialRegex, '');
      if (article_nme.length === 0) {
        createArticleResult.message = message.INVALID_INPUT;
        return createArticleResult;
      }
      if (group_id && validator.isUUID(group_id, '4')) {
        const findGroup = await DBconnection(TABLE_GROUP)
          .select('*')
          .where({ group_id })
          .first();
        if (!findGroup) {
          createArticleResult.message = message.NOT_FOUND_GROUP;
          return createArticleResult;
        }
      } else {
        group_id = null;
      }
      only_me = !!only_me;

      const createResult = await DBconnection(TABLE_ARTICLE)
        .insert({
          article_nme,
          group_id,
          created_user_id: requestUser.user_id,
          only_me,
        })
        .returning('*');

      if (createResult) {
        createArticleResult.success = true;
        createArticleResult.result = createResult[0];
        createArticleResult.message = message.CREATE_SUCCESS;
      } else {
        createArticleResult.message = message.CREATE_FAIL;
      }
      return createArticleResult;
    },
    updateArticle: async (parent, { articleInfo }, { requestUser }, info) => {
      let { article_nme, article_id } = articleInfo;
      article_nme = article_nme.replace(specialRegex, '');
      if (
        article_nme.length === 0 ||
        !article_id ||
        !validator.isUUID(article_id, '4')
      ) {
        updateArticleResult.message = message.INVALID_INPUT;
        return updateArticleResult;
      }
      const findArticle = await DBconnection(TABLE_ARTICLE)
        .select('*')
        .where({ article_id })
        .first();
      if (!findArticle) {
        updateArticleResult.message = message.NOT_FOUND_ARTICLE;
        return updateArticleResult;
      }
      const updateResult = await DBconnection(TABLE_ARTICLE)
        .where({ article_id })
        .update({ article_nme })
        .returning('*');

      if (updateResult) {
        updateArticleResult.success = true;
        updateArticleResult.result = updateResult[0];
        updateArticleResult.message = message.UPDATE_SUCCESS;
      } else {
        updateArticleResult.message = message.UPDATE_FAIL;
      }
      return updateArticleResult;
    },
  },
};
