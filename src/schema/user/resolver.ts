import validator from 'validator';
import { message } from '../../constants/message';
import { user_table } from '../../constants/table_name';
import { DBconnection } from '../../database';
import * as jwt from 'jsonwebtoken';
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

const allowPhoneLocale: any[] = ['zh-CN'];
export default {
  GENDERENUM: {
    MALE: 'male',
    FEMALE: 'female',
    UNKNOWN: 'unknown',
  },
  Query: {
    me: async (parent, args, { requestUser }, info) => {
      return DBconnection(user_table)
        .where({ user_id: requestUser.user_id })
        .select('*');
    },
    verifyCode: async (parent, { code }, { requestUser }, info) => {
      const selectResult = await DBconnection(user_table)
        .where({ user_id: requestUser.user_id, phone_nbr_verify_code: code })
        .select('*');
      if (selectResult.length === 0) {
        verifyCodeResult.result = await DBconnection(user_table)
          .where({ user_id: requestUser.user_id })
          .select('*');
        verifyCodeResult.message = message.WRONG_CODE;
        return verifyCodeResult;
      }
      const phoneNbrCodeUpdate = {
        phone_nbr_verify_code: null,
        phone_nbr_verify_code_created_tms: null,
      };
      const updateResult = await DBconnection(user_table)
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
  },
  Mutation: {
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
      const queryResult = await DBconnection(user_table)
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
          inserOrUpdate = await DBconnection(user_table)
            .insert(accountInfo)
            .returning('*');
        } else {
          inserOrUpdate = await DBconnection(user_table)
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
  },
};

function generateRandomDigitalNumbers(length: number): String {
  var res = '';
  for (let i = 0; i < length; i++) {
    res += Math.ceil(Math.random() * 9);
  }
  return res;
}
