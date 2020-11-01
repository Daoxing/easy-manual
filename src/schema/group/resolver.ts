import validator from 'validator';
import { specialRegex } from '../../constants/common';
import { message } from '../../constants/message';
import {
  TABLE_ARTICLE,
  TABLE_GROUP,
  TABLE_USER,
  TABLE_USER_IN_GROUP,
} from '../../constants/table_name';
import { DBconnection } from '../../database';
import { graphqlResult } from '../types';

const createGroupResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

const updateGroupResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

const inviteUserToGroupResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

const approveUserToGroupResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

const rejectUserToGroupResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

const deleteGroupResult: graphqlResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};
const searchGroupsByNameResult = {
  success: false,
  result: [],
  message: message.INTERNAL_ERROR,
};

export default {
  Group: {
    created_user: (parent, args, { requestUser }, info) => {
      return requestUser;
    },
  },
  GroupMembers: {
    count: (parent, { group_id }, { requestUser }, info) => {
      return DBconnection(TABLE_USER_IN_GROUP)
        .select('COUNT(1)')
        .where({ group_id, approved: true })
        .orderBy('joined_tms', 'asc');
    },
    members: (parent, { group_id }, { requestUser }, info) => {
      return DBconnection.select('group.*')
        .from(TABLE_USER_IN_GROUP)
        .leftJoin(
          TABLE_USER,
          `${TABLE_USER_IN_GROUP}.user_id`,
          `${TABLE_USER}.user_id`,
        )
        .where({ group_id, approved: true })
        .orderBy('joined_tms', 'asc');
    },
  },
  joinGroupRequest: {
    count: (parent, { group_id }, context, info) => {
      return DBconnection(TABLE_USER_IN_GROUP)
        .select('COUNT(1)')
        .where({ group_id, approved: false })
        .orderBy('joined_tms', 'desc');
    },
    members: (parent, { group_id }, context, info) => {
      return DBconnection.select('group.*')
        .from(TABLE_USER_IN_GROUP)
        .leftJoin(
          TABLE_USER,
          `${TABLE_USER_IN_GROUP}.user_id`,
          `${TABLE_USER}.user_id`,
        )
        .where({ group_id, approved: false })
        .orderBy('joined_tms', 'desc');
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
        .where({ user_id: requestUser.user_id, approved: true });
    },
    searchGroupByName: async (parent, { searchInfo }, context, info) => {
      const { name = '' } = searchInfo;
      name.replace(specialRegex, '');
      if (name.length === 0) {
        searchGroupsByNameResult.message = message.INVALID_INPUT;
        return searchGroupsByNameResult;
      }
      const groups = await DBconnection(TABLE_GROUP).select('*').whereRaw(`
      POSITION (LOWER('${name}') IN LOWER(group_nme))>0
      `);
      searchGroupsByNameResult.success = true;
      searchGroupsByNameResult.result = groups;
      searchGroupsByNameResult.message = message.SUCCESS;
      return searchGroupsByNameResult;
    },
  },
  Mutation: {
    createGroup: async (parent, { groupInfo }, { requestUser }, info) => {
      const { group_nme = '', group_intro = null } = groupInfo;
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
            createGroupResult.message = message.CREATE_FAIL;
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

    updateGroup: async (parent, { groupInfo }, { requestUser }, info) => {
      const { group_nme, group_id = null, group_intro } = groupInfo;
      group_nme.replace(specialRegex, '');
      if (group_id && validator.isUUID(group_id, '4')) {
        const findGroup = await DBconnection(TABLE_GROUP)
          .select('*')
          .where({ group_id })
          .first();
        if (!findGroup) {
          updateGroupResult.message = message.NOT_FOUND_GROUP;
          return updateGroupResult;
        }
      } else {
        updateGroupResult.message = message.INVALID_INPUT;
        return updateGroupResult;
      }
      let updateData = {};
      if (group_nme !== undefined && group_nme.length !== 0) {
        updateData = Object.assign(updateData, { group_nme });
      }
      if (group_intro !== undefined && group_intro.length !== 0) {
        updateData = Object.assign(updateData, { group_intro });
      }
      if (Object.keys(updateData).length === 0) {
        updateGroupResult.message = message.INVALID_INPUT;
        return updateGroupResult;
      }
      const updateResult = await DBconnection(TABLE_GROUP)
        .where({ group_id })
        .update(updateData)
        .returning('*');

      if (updateResult) {
        updateGroupResult.success = true;
        updateGroupResult.result = updateResult[0];
        updateGroupResult.message = message.UPDATE_SUCCESS;
      } else {
        updateGroupResult.message = message.UPDATE_FAIL;
      }
      return updateGroupResult;
    },
    inviteUserToGroup: async (
      parent,
      { inviteInfo },
      { requestUser },
      info,
    ) => {
      const { user_id, group_id } = inviteInfo;
      let findGroup;
      if (group_id && validator.isUUID(group_id, '4')) {
        findGroup = await DBconnection(TABLE_GROUP)
          .select('*')
          .where({ group_id })
          .first();
        if (!findGroup) {
          inviteUserToGroupResult.message = message.NOT_FOUND_GROUP;
          return inviteUserToGroupResult;
        }
        if (findGroup.created_user_id === user_id) {
          inviteUserToGroupResult.message = message.INVALID_INPUT;
          return inviteUserToGroupResult;
        }
      } else {
        inviteUserToGroupResult.message = message.INVALID_INPUT;
        return inviteUserToGroupResult;
      }
      let findUser;
      if (user_id && validator.isUUID(user_id, '4')) {
        findUser = await DBconnection(TABLE_USER)
          .select('*')
          .where({ user_id })
          .first();
        if (!findUser) {
          inviteUserToGroupResult.message = message.NOT_FOUND_USER;
          return inviteUserToGroupResult;
        }
      } else {
        inviteUserToGroupResult.message = message.INVALID_INPUT;
        return inviteUserToGroupResult;
      }
      const joinGroupData = {
        user_id,
        group_id,
        approved: findGroup.created_user_id === requestUser.user_id,
      };

      const joinGroupResult = await DBconnection(TABLE_USER_IN_GROUP)
        .insert(joinGroupData)
        .returning('*');
      if (joinGroupResult.length > 0) {
        inviteUserToGroupResult.success = true;
        inviteUserToGroupResult.result = joinGroupResult[0];
        inviteUserToGroupResult.message =
          findGroup.created_user_id === requestUser.user_id
            ? message.CREATE_SUCCESS
            : message.WAITING_FOR_APPROVE;
      } else {
        inviteUserToGroupResult.message = message.CREATE_FAIL;
      }
      return inviteUserToGroupResult;
    },
    approveUserToGroup: async (
      parent,
      { approveInfo },
      { requestUser },
      info,
    ) => {
      const { user_id, group_id } = approveInfo;
      if (
        user_id &&
        validator.isUUID(user_id, '4') &&
        group_id &&
        validator.isUUID(group_id, '4')
      ) {
        const findUserInGroup = await DBconnection(TABLE_USER_IN_GROUP)
          .select('*')
          .where({ user_id, group_id, approved: false })
          .first();
        if (!findUserInGroup) {
          approveUserToGroupResult.message = message.NOT_FOUND_JOIN_REQUEST;
          return approveUserToGroupResult;
        }
      } else {
        approveUserToGroupResult.message = message.INVALID_INPUT;
        return approveUserToGroupResult;
      }
      const findGroup = await DBconnection(TABLE_GROUP)
        .select('*')
        .where({ group_id })
        .first();

      if (findGroup.created_user_id !== requestUser.user_id) {
        approveUserToGroupResult.message = message.NO_PERMISSION;
        return approveUserToGroupResult;
      }
      const updateUserInGroup = await DBconnection(TABLE_USER_IN_GROUP)
        .update({ approved: true })
        .where({
          user_id,
          group_id,
          approved: false,
        });

      if (updateUserInGroup) {
        approveUserToGroupResult.success = true;
        approveUserToGroupResult.result = findGroup;
        approveUserToGroupResult.message = message.UPDATE_SUCCESS;
      } else {
        approveUserToGroupResult.message = message.UPDATE_FAIL;
        return approveUserToGroupResult;
      }
      return approveUserToGroupResult;
    },
    rejectUserToGroup: async (
      parent,
      { rejectInfo },
      { requestUser },
      info,
    ) => {
      const { user_id, group_id } = rejectInfo;
      if (
        user_id &&
        validator.isUUID(user_id, '4') &&
        group_id &&
        validator.isUUID(group_id, '4')
      ) {
        const findUserInGroup = await DBconnection(TABLE_USER_IN_GROUP)
          .select('*')
          .where({ user_id, group_id, approved: false })
          .first();
        if (!findUserInGroup) {
          rejectUserToGroupResult.message = message.NOT_FOUND_JOIN_REQUEST;
          return rejectUserToGroupResult;
        }
      } else {
        rejectUserToGroupResult.message = message.INVALID_INPUT;
        return rejectUserToGroupResult;
      }
      const findGroup = await DBconnection(TABLE_GROUP)
        .select('*')
        .where({ group_id })
        .first();

      if (findGroup.created_user_id !== requestUser.user_id) {
        rejectUserToGroupResult.message = message.NO_PERMISSION;
        return rejectUserToGroupResult;
      }
      const deleteJoinRequest = await DBconnection(TABLE_USER_IN_GROUP)
        .delete()
        .where({
          user_id,
          group_id,
          approved: false,
        })
        .limit(1);

      if (deleteJoinRequest) {
        rejectUserToGroupResult.success = true;
        rejectUserToGroupResult.result = findGroup;
        rejectUserToGroupResult.message = message.UPDATE_SUCCESS;
      } else {
        rejectUserToGroupResult.message = message.UPDATE_FAIL;
        return rejectUserToGroupResult;
      }
      return rejectUserToGroupResult;
    },
    deleteGroup: async (
      parent,
      { groupId: group_id },
      { requestUser },
      info,
    ) => {
      const findGroup = await DBconnection(TABLE_GROUP)
        .select('*')
        .where({ group_id })
        .first();
      if (!findGroup) {
        deleteGroupResult.message = message.NOT_FOUND_GROUP;
        return deleteGroupResult;
      }

      if (findGroup.created_user_id !== requestUser.user_id) {
        deleteGroupResult.message = message.NO_PERMISSION;
        return deleteGroupResult;
      }

      const trxResult = await DBconnection.transaction(async (trx) => {
        // 1. SET ARTICLES IN THIS GROUP TO PRIVATE
        const updateResult = await trx(TABLE_ARTICLE)
          .update({ group_id: null, only_me: true })
          .where({ group_id });
        // 2. DELETE USER IN GROUP
        const deleteUsersResult = await trx(TABLE_USER_IN_GROUP)
          .delete()
          .where({ group_id })
          .andWhereNot({ user_id: requestUser.user_id });

        return true;
      });

      deleteGroupResult.success = trxResult;
      deleteGroupResult.message = trxResult
        ? message.DELETE_SUCCESS
        : message.DELETE_FAIL;
      deleteGroupResult.result = trxResult ? findGroup : {};
    },
  },
};
