import { result } from 'lodash';
import validator from 'validator';
import { specialRegex } from '../../constants/common';
import { message } from '../../constants/message';
import {
  TABLE_ARTICLE,
  TABLE_COMMENT,
  TABLE_GROUP,
  TABLE_USER_IN_GROUP,
} from '../../constants/table_name';
import { DBconnection } from '../../database';

const createCommentResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

const updateCommentResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

const deleteCommentResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

export default {
  Comment: {
    created_user: (parent, args, { requestUser }, info) => {
      return requestUser;
    },
    article: ({ article_id }, args, { requestUser }, info) => {
      return DBconnection.select('*').from(TABLE_ARTICLE).where({ article_id });
    },
  },
  Query: {
    commentList: async (
      parent,
      { articleId: article_id },
      { requestUser },
      info,
    ) => {
      return {
        success: true,
        message: message.SUCCESS,
        result: DBconnection.select('*')
          .from(TABLE_COMMENT)
          .where({ article_id })
          .orderBy('created_tms', 'asc'),
      };
    },
  },
  Mutation: {
    createComment: async (parent, { commentInfo }, { requestUser }, info) => {
      const { comment_txt = '', article_id = null } = commentInfo;
      if (comment_txt.length === 0) {
        createCommentResult.message = message.INVALID_INPUT;
        return createCommentResult;
      }
      if (article_id && validator.isUUID(article_id, '4')) {
        const findArticle = await DBconnection(TABLE_ARTICLE)
          .select('*')
          .where({ article_id })
          .first();
        if (!findArticle) {
          createCommentResult.message = message.NOT_FOUND_ARTICLE;
          return createCommentResult;
        }
      } else {
        createCommentResult.message = message.INVALID_INPUT;
        return createCommentResult;
      }
      const createResult = await DBconnection(TABLE_COMMENT)
        .insert({
          article_id,
          comment_txt,
          created_user_id: requestUser.user_id,
        })
        .returning('*');
      if (createResult) {
        createCommentResult.success = true;
        createCommentResult.result = createResult[0];
        createCommentResult.message = message.CREATE_SUCCESS;
      } else {
        createCommentResult.message = message.CREATE_FAIL;
      }
      return createCommentResult;
    },
    updateComment: async (parent, { commentInfo }, { requestUser }, info) => {
      const { comment_txt = '', comment_id = null } = commentInfo;
      if (comment_txt.length === 0) {
        createCommentResult.message = message.INVALID_INPUT;
        return createCommentResult;
      }
      if (comment_id && validator.isUUID(comment_id, '4')) {
        const findComment = await DBconnection(TABLE_COMMENT)
          .select('*')
          .where({ comment_id })
          .first();
        if (!findComment) {
          createCommentResult.message = message.NOT_FOUND_COMMENT;
          return createCommentResult;
        }
        if (findComment.created_user_id !== requestUser.user_id) {
          createCommentResult.message = message.NO_PERMISSION;
          return createCommentResult;
        }
      } else {
        createCommentResult.message = message.INVALID_INPUT;
        return createCommentResult;
      }
      const updateResult = await DBconnection(TABLE_COMMENT)
        .where({ comment_id })
        .update({ comment_txt })
        .returning('*');

      if (updateResult) {
        updateCommentResult.success = true;
        updateCommentResult.result = updateResult[0];
        updateCommentResult.message = message.UPDATE_SUCCESS;
      } else {
        updateCommentResult.message = message.UPDATE_FAIL;
      }
      return updateCommentResult;
    },
    deleteComment: async (
      parent,
      { commentId: comment_id },
      { requestUser },
      info,
    ) => {
      const comment = await DBconnection(TABLE_COMMENT)
        .select('*')
        .where({ comment_id })
        .first();
      if (!comment) {
        deleteCommentResult.message = message.NOT_FOUND_CHAPTER;
        return deleteCommentResult;
      }
      const deleteComment = await DBconnection(TABLE_COMMENT)
        .delete()
        .where({ comment_id, created_user_id: requestUser.user_id })
        .first();
      if (!deleteComment) {
        deleteCommentResult.message = message.DELETE_FAIL;
        return deleteCommentResult;
      }
      deleteCommentResult.result = comment;
      deleteCommentResult.success = true;
      deleteCommentResult.message = message.SUCCESS;
      return deleteCommentResult;
    },
  },
};
