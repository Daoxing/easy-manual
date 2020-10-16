import { specialRegex } from '../../constants/common';
import { message } from '../../constants/message';
import { TABLE_GROUP, TABLE_USER_IN_GROUP } from '../../constants/table_name';
import { DBconnection } from '../../database';

const createGroupResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

export default {
  Group: {
    created_user: (parent, args, { requestUser }, info) => {
      return requestUser;
    },
  },
  Query: {
    myGroups: async (parent, args, { requestUser }, info) => {
      return DBconnection.select('group.*')
        .from(TABLE_GROUP)
        .leftJoin(
          TABLE_USER_IN_GROUP,
          `${TABLE_GROUP}.group_id`,
          `${TABLE_USER_IN_GROUP}.group_id`,
        )
        .where({ user_id: requestUser.user_id });
    },
  },
  Mutation: {
    createGroup: async (parent, { groupInfo }, { requestUser }, info) => {
      const { group_nme = null, group_intro = null } = groupInfo;
      group_nme.replace(specialRegex, '');
      if (group_nme.length === 0) {
        createGroupResult.message = message.INVALID_INPUT;
        return createGroupResult;
      }
      const insertGroup = {
        group_nme,
        group_intro,
        created_user_id: requestUser.user_id,
      };

      try {
        const trxresult = await DBconnection.transaction(async (trx) => {
          const insertGroupResult = await trx(TABLE_GROUP)
            .insert(insertGroup)
            .returning('*');

          const { created_user_id, group_id } = insertGroupResult[0];

          const insertUserInGroupResult = await trx(TABLE_USER_IN_GROUP)
            .insert({ group_id, user_id: created_user_id })
            .returning('*');

          if (
            insertGroupResult.length === 0 ||
            insertUserInGroupResult.length === 0
          ) {
            createGroupResult.message = 'Insert Fail!';
            return createGroupResult;
          }

          createGroupResult.success = true;
          createGroupResult.result = insertGroupResult[0];
          createGroupResult.message = message.CREATE_SUCCESS;
        });
      } catch (error) {
        console.error(error);
        return createGroupResult;
      }

      return createGroupResult;
    },
  },
};
