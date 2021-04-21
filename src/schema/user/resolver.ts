import validator from 'validator';
import { message } from '../../constants/message';
import { TABLE_USER, TABLE_USER_IN_GROUP } from '../../constants/table_name';
import { DBconnection } from '../../database';

import * as _ from 'lodash';
import { UserService } from '../../services/user.service';
import { ISchemaResult } from '../../types';

const UpdateUserResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

export default {
  GENDERENUM: {
    MALE: 'male',
    FEMALE: 'female',
    UNKNOWN: 'unknown',
  },
  Query: {
    me: async (parent, args, { requestUser }, info) => {
      return UserService.me(requestUser);
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
        console.error(error);
        result.result = await UserService.me(requestUser);
        result.message = error.message ? error.message : message.INTERNAL_ERROR;
      }
      return result;
    },
    updateUser: async (parent, { userInfo }, { requestUser }, info) => {
      const { email_address, phone_nbr, user_nme } = userInfo;
      if (_.isEmpty(email_address) && _.isEmpty(phone_nbr)) {
        UpdateUserResult.message = message.INVALID_INPUT;
        return UpdateUserResult;
      }
      // TODO: user_name should replace all special characters.
      // TODO: check email and phone number is working.
      if (!_.isUndefined(user_nme) && _.isEmpty(user_nme)) {
        UpdateUserResult.message = message.NAME_SHOULD_NOT_NULL;
        return UpdateUserResult;
      }
      if (email_address) {
        if (!validator.isEmail(email_address)) {
          UpdateUserResult.message = message.WRONG_EMAIL_FORMAT;
          return UpdateUserResult;
        }
        const checkEmailResult = await DBconnection(TABLE_USER)
          .where({ email_address })
          .andWhereNot({ user_id: requestUser.user_id })
          .select('*')
          .first();
        if (checkEmailResult) {
          UpdateUserResult.message = message.EMAIL_EXIST;
          return UpdateUserResult;
        }
      }
      if (phone_nbr) {
        if (!validator.isMobilePhone(`${phone_nbr}`, 'zh-CN')) {
          UpdateUserResult.message = message.WRONG_PHONE_NBR_FORMAT;
          return UpdateUserResult;
        }
        const checkEmailResult = await DBconnection(TABLE_USER)
          .where({ phone_nbr })
          .andWhereNot({ user_id: requestUser.user_id })
          .select('*')
          .first();
        if (checkEmailResult) {
          UpdateUserResult.message = message.EMAIL_EXIST;
          return UpdateUserResult;
        }
      }
      const updateResult = await DBconnection(TABLE_USER)
        .where({ user_id: requestUser.user_id })
        .update(userInfo)
        .returning('*');
      if (updateResult) {
        UpdateUserResult.success = true;
        UpdateUserResult.result = updateResult[0];
        UpdateUserResult.message = message.UPDATE_SUCCESS;
      }
      return UpdateUserResult;
    },
  },
};
