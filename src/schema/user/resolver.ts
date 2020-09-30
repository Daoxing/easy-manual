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

const allowPhoneLocale: any[] = ['zh-CN'];
export default {
  Query: {
    me: () => {
      return { user_id: 'bbbbb' };
    },
  },
  Mutation: {
    login: async (parent, { account }, context, info) => {
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
