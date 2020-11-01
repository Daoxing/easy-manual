import validator from 'validator';
import { message } from '../../constants/message';
import { TABLE_USER, TABLE_USER_IN_GROUP } from '../../constants/table_name';
import { DBconnection } from '../../database';
import * as jwt from 'jsonwebtoken';
import _ = require('lodash');
import { specialRegex } from '../../constants/common';
const defaultLoginResult = {
  success: false,
  result: '',
  message: message.INTERNAL_ERROR,
  goto: '/verify-code',
};

const verifyCodeResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

const UpdateUserResult = {
  success: false,
  result: {},
  message: message.INTERNAL_ERROR,
};

const searchUsersByNameResult = {
  success: false,
  result: [],
  message: message.INTERNAL_ERROR,
};

const allowPhoneLocale: any[] = ['zh-CN'];
export default {
  GENDERENUM: {
    MALE: 'male',
    FEMALE: 'female',
    UNKNOWN: 'unknown',
  },
  Query: {
    me: async (parent, args, { requestUser }, info) => {
      return DBconnection(TABLE_USER)
        .where({ user_id: requestUser.user_id })
        .select('*');
    },
    searchUsersByName: async (
      parent,
      { searchInfo },
      { requestUser },
      info,
    ) => {
      const { name = '', group_id = null } = searchInfo;
      name.replace(specialRegex, '');
      if (_.isEmpty(name)) {
        searchUsersByNameResult.message = message.INVALID_INPUT;
        return searchUsersByNameResult;
      }
      let users = [];
      if (group_id) {
        users = await DBconnection.select(`${TABLE_USER}.*`)
          .from(TABLE_USER_IN_GROUP)
          .leftJoin(
            TABLE_USER,
            `${TABLE_USER_IN_GROUP}.user_id`,
            `${TABLE_USER}.user_id`,
          )
          .where({ group_id })
          .andWhereRaw(
            `POSITION( LOWER(${name}) IN LOWER(${TABLE_USER}.user_nme))>0`,
          )
          .orderBy(`${TABLE_USER}.user_nme`, 'asc');
      } else {
        users = await DBconnection.select('*')
          .from(TABLE_USER)
          .whereRaw(`POSITION( LOWER(${name}) IN LOWER(user_nme))>0`)
          .orderBy(`user_nme`, 'asc');
      }
      searchUsersByNameResult.success = true;
      searchUsersByNameResult.message = message.SUCCESS;
      searchUsersByNameResult.result = users;
      return searchUsersByNameResult;
    },
  },
  Mutation: {
    verifyCode: async (parent, { code }, { requestUser }, info) => {
      const selectResult = await DBconnection(TABLE_USER)
        .where({ user_id: requestUser.user_id, phone_nbr_verify_code: code })
        .select('*');
      if (selectResult.length === 0) {
        verifyCodeResult.result = await DBconnection(TABLE_USER)
          .where({ user_id: requestUser.user_id })
          .select('*');
        verifyCodeResult.message = message.WRONG_CODE;
        return verifyCodeResult;
      }
      const phoneNbrCodeUpdate = {
        phone_nbr_verify_code: null,
        phone_nbr_verify_code_created_tms: null,
      };
      const updateResult = await DBconnection(TABLE_USER)
        .where({ user_id: requestUser.user_id, phone_nbr_verify_code: code })
        .update(phoneNbrCodeUpdate)
        .returning('*');
      if (updateResult.length !== 0) {
        verifyCodeResult.success = true;
        verifyCodeResult.result = updateResult[0];
        verifyCodeResult.message = message.VERIFY_SUCCESS;
      }
      return verifyCodeResult;
    },
    login: async (parent, { account }, context, info) => {
      // TODO: SEND EMAIL AND TEXT MESSAGE
      // TODO: VERIFY EMAIL AND PHONE NUMBER IS AVAILABLE
      if ((account as string).length === 0) {
        defaultLoginResult.message = message.NOT_FOUND_ACCOUNT;
        return defaultLoginResult;
      }
      let accountInfo = {};
      if (validator.isEmail(account)) {
        accountInfo = { email_address: account };
      } else if (validator.isMobilePhone(account, allowPhoneLocale)) {
        accountInfo = { phone_nbr: account };
      }
      if (Object.keys(accountInfo).length === 0) {
        defaultLoginResult.message = message.WRONG_ACCOUNT;
        return defaultLoginResult;
      }
      const queryResult = await DBconnection(TABLE_USER)
        .where(accountInfo)
        .select('*');
      try {
        const phoneNbrCodeUpdate = {
          phone_nbr_verify_code: generateRandomDigitalNumbers(6),
          phone_nbr_verify_code_created_tms: new Date(),
        };
        let inserOrUpdate;
        if (queryResult.length === 0) {
          accountInfo = Object.assign(accountInfo, phoneNbrCodeUpdate);
          inserOrUpdate = await DBconnection(TABLE_USER)
            .insert(accountInfo)
            .returning('*');
        } else {
          inserOrUpdate = await DBconnection(TABLE_USER)
            .where(accountInfo)
            .update(phoneNbrCodeUpdate)
            .returning('*');
        }
        if (!inserOrUpdate) {
          throw new Error('Update Failed!');
        }
        defaultLoginResult.success = true;
        defaultLoginResult.result = `${jwt.sign({ account }, 'serectkey')}`;
        defaultLoginResult.message = message.LOGIN_SUCCESS;
      } catch (error) {
        console.error(error.message);
        defaultLoginResult.message = error.message;
        return defaultLoginResult;
      }

      return defaultLoginResult;
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

function generateRandomDigitalNumbers(length: number): String {
  var res = '';
  for (let i = 0; i < length; i++) {
    res += Math.ceil(Math.random() * 9);
  }
  return res;
}
