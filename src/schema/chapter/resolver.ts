import validator from 'validator';
import { message } from '../../constants/message';
import { TABLE_ARTICLE, TABLE_CHAPTER } from '../../constants/table_name';
import { DBconnection } from '../../database';

const getChapterResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

const createChapterResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

const updateArticleResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

const deleteArticleResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

export default {
  Chapter: {
    article: ({ article_id }, args, { requestUser }, info) => {
      return article_id
        ? DBconnection(TABLE_ARTICLE).select('*').where({ article_id }).first()
        : null;
    },
    sub_chapters: ({ chapter_id }, args, { requestUser }, info) => {
      return chapter_id
        ? DBconnection(TABLE_CHAPTER)
            .select('*')
            .where({ parent_chapter_id: chapter_id })
            .orderBy('order', 'asc')
        : [];
    },
  },
  Query: {
    getChapter: async (parent, { chapterId: chapter_id }, context, info) => {
      const chapter = await DBconnection(TABLE_CHAPTER)
        .select('*')
        .where({ chapter_id })
        .first();
      if (!chapter) {
        getChapterResult.message = message.NOT_FOUND_CHAPTER;
        return getChapterResult;
      }
      getChapterResult.result = chapter;
      getChapterResult.success = true;
      getChapterResult.message = message.SUCCESS;
      return getChapterResult;
    },
  },
  Mutation: {
    createChapter: async (parent, { chapterInfo }, { requestUser }, info) => {
      let {
        article_id,
        chapter_title,
        chapter_content,
        parent_chapter_id,
      } = chapterInfo;

      if (chapter_title.length === 0) {
        createChapterResult.message = message.INVALID_INPUT;
        return createChapterResult;
      }
      if (article_id && validator.isUUID(article_id, '4')) {
        const findGroup = await DBconnection(TABLE_ARTICLE)
          .select('*')
          .where({ article_id })
          .first();
        if (!findGroup) {
          createChapterResult.message = message.NOT_FOUND_ARTICLE;
          return createChapterResult;
        }
      }
      if (parent_chapter_id && validator.isUUID(parent_chapter_id, '4')) {
        const findGroup = await DBconnection(TABLE_CHAPTER)
          .select('*')
          .where({ parent_chapter_id })
          .first();
        if (!findGroup) {
          createChapterResult.message = message.NOT_FOUND_ARTICLE;
          return createChapterResult;
        }
      } else {
        parent_chapter_id = null;
      }

      const maxOrder = await DBconnection(TABLE_CHAPTER)
        .where({ article_id, parent_chapter_id })
        .max('order')
        .first();

      const createResult = await DBconnection(TABLE_CHAPTER)
        .insert({
          article_id,
          chapter_title,
          chapter_content,
          parent_chapter_id,
          order: maxOrder + 1,
        })
        .returning('*');

      if (createResult) {
        createChapterResult.success = true;
        createChapterResult.result = createResult[0];
        createChapterResult.message = message.CREATE_SUCCESS;
      } else {
        createChapterResult.message = message.CREATE_FAIL;
      }
      return createChapterResult;
    },
    updateChapter: async (parent, { chapterInfo }, { requestUser }, info) => {
      let { chapter_id, chapter_title, chapter_content } = chapterInfo;
      if (
        !chapter_title ||
        (!chapter_title && !chapter_content) ||
        !chapter_id ||
        !validator.isUUID(chapter_id, '4')
      ) {
        updateArticleResult.message = message.INVALID_INPUT;
        return updateArticleResult;
      }
      const findChapter = await DBconnection(TABLE_CHAPTER)
        .select('*')
        .where({ chapter_id })
        .first();
      if (!findChapter) {
        updateArticleResult.message = message.NOT_FOUND_CHAPTER;
        return updateArticleResult;
      }
      let updateData = {};
      if (chapter_title !== undefined) {
        updateData = Object.assign(updateData, { chapter_title });
      }
      if (chapter_content !== undefined) {
        updateData = Object.assign(updateData, { chapter_content });
      }
      if (Object.keys(updateData).length === 0) {
        updateArticleResult.message = message.INVALID_INPUT;
        return updateArticleResult;
      }
      const updateResult = await DBconnection(TABLE_CHAPTER)
        .where({ chapter_id })
        .update(updateData)
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
    deleteChapter: async (
      parent,
      { chapterId: chapter_id },
      { requestUser },
      info,
    ) => {
      const chapter = await DBconnection(TABLE_CHAPTER)
        .select('*')
        .where({ chapter_id })
        .first();
      if (!chapter) {
        deleteArticleResult.message = message.NOT_FOUND_CHAPTER;
        return deleteArticleResult;
      }
      const deleteChapter = await DBconnection(TABLE_CHAPTER)
        .delete()
        .where({ chapter_id })
        .first();
      if (!deleteChapter) {
        deleteArticleResult.message = message.DELETE_FAIL;
        return deleteArticleResult;
      }
      deleteArticleResult.result = chapter;
      deleteArticleResult.success = true;
      deleteArticleResult.message = message.SUCCESS;
      return deleteArticleResult;
    },
  },
};
