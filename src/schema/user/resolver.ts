import { message } from '../../constants/message';
import { ISchemaResult } from '../../types';
import { GroupService, UserService } from '../../services';
import { defaultPage } from '../../constants';

export default {
  User: {
    my_groups: async (parent, args, { requestUser }, info) => {
      return [];
    },
    my_articles: async (parent, args, { requestUser }, info) => {},
    my_accessible_articles: async (parent, args, { requestUser }, info) => {},
    my_public_articles: async (parent, args, { requestUser }, info) => {},
  },
  GENDERENUM: {
    MALE: 'male',
    FEMALE: 'female',
    UNKNOWN: 'unknown',
  },
  Query: {
    me: (parent, args, { requestUser }, info) => {
      return UserService.me(requestUser);
    },
    findUserById: async (parent, { id }, context, info) => {
      const result: ISchemaResult = {
        success: false,
        message: '',
      };
      try {
        const user = await UserService.findUserById(id);
        result.success = true;
        result.result = user;
        result.message = message.SUCCESS;
      } catch (error) {
        result.message = error.message ? error.message : message.INTERNAL_ERROR;
      }
      return result;
    },
    searchUsersByName: async (parent, { searchInfo }, context, info) => {
      const result: ISchemaResult = {
        success: false,
        message: '',
      };
      try {
        const users = await UserService.searchUsersByName(searchInfo);
        result.success = true;
        result.result = users;
        result.message = message.SUCCESS;
      } catch (error) {
        result.message = error.message ? error.message : message.INTERNAL_ERROR;
      }
      return result;
    },
    usersInGroup: async (
      parent,
      { group_id, page, sort },
      { requestUser },
      info,
    ) => {
      page = page ? page : defaultPage;
      try {
        return {
          totalCount: UserService.findUsersCountInGroup(group_id),
          users: await UserService.findUsersInGroup(group_id, sort, page),
          page,
        };
      } catch (error) {}
      return {
        totalCount: 0,
        articles: [],
        page,
      };
    },
  },
  Mutation: {
    verifyCode: async (parent, { code }, { requestUser }, info) => {
      const result: ISchemaResult = {
        success: false,
        message: '',
      };
      try {
        const user = await UserService.verifyCode(code, requestUser);
        result.success = true;
        result.result = user;
        result.message = message.SUCCESS;
      } catch (error) {
        result.result = await UserService.me(requestUser);
        result.message = error.message ? error.message : message.INTERNAL_ERROR;
      }
      return result;
    },
    updateUser: async (parent, { userInfo }, { requestUser }, info) => {
      const result: ISchemaResult = {
        success: false,
        message: '',
      };
      try {
        const user = await UserService.updateUser(userInfo, requestUser);
        result.success = true;
        result.result = user;
        result.message = message.SUCCESS;
      } catch (error) {
        result.message = error.message ? error.message : message.INTERNAL_ERROR;
      }
      return result;
    },
  },
};
