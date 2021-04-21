import {
  IRequestingUser,
  LoginByEmail,
  LoginByPhoneNbr,
  NewUser,
  SearchUsersByNameInput,
} from '../types';
import { UserModel } from '../models';
import { message, specialRegex } from '../constants';
import * as _ from 'lodash';
import validator from 'validator';
import { generateRandomDigitalNumbers } from '../utils';
import envConfig from '../config';
// Query
const me = async (requestingUser: IRequestingUser) => {
  return UserModel.findUserById(requestingUser.user_id);
};

// Search
const searchUsersByName = async (searchInfo: SearchUsersByNameInput) => {
  const { name = '', group_id = null } = searchInfo;
  name.replace(specialRegex, '');
  if (_.isEmpty(name)) {
    throw new Error(message.INVALID_INPUT);
  }
  let users = [];
  if (group_id) {
    users = await UserModel.findUsersInGroupByName(name, group_id);
  } else {
    users = await UserModel.findUsersByNames(name);
  }
};

// Verify
const verifyCode = async (code: string, requestingUser: IRequestingUser) => {
  const selectResult = await UserModel.verifyCode(requestingUser.user_id, code);
  if (!selectResult) {
    throw new Error(message.WRONG_CODE);
  }
  const updateResult = await UserModel.clearVerifyCode(
    requestingUser.user_id,
    code,
  );
  return updateResult[0];
};

// Login
const login = async (account: string) => {
  // TODO: SEND EMAIL AND TEXT MESSAGE
  // TODO: VERIFY EMAIL AND PHONE NUMBER IS AVAILABLE
  if (account.length === 0) {
    throw new Error(message.NOT_FOUND_ACCOUNT);
  }
  account = account.toLowerCase();
  let accountInfo: LoginByEmail | LoginByPhoneNbr;
  if (validator.isEmail(account)) {
    accountInfo = { email_address: account };
  } else if (validator.isMobilePhone(account, envConfig.ALLOW_PHONE_LOCALE)) {
    accountInfo = { phone_nbr: account };
  } else {
    throw new Error(message.WRONG_ACCOUNT);
  }
  if (Object.keys(accountInfo).length === 0) {
    throw new Error(message.WRONG_ACCOUNT);
  }
  const queryResult = await UserModel.findLoginUser(accountInfo);
  const phoneNbrCodeUpdate = {
    verify_code: generateRandomDigitalNumbers(6),
    verify_code_created_tms: new Date(),
  };
  let inserOrUpdate;
  if (!queryResult) {
    const newUserInfo: NewUser = Object.assign(
      accountInfo,
      phoneNbrCodeUpdate,
    ) as NewUser;
    inserOrUpdate = (await UserModel.insertUser(newUserInfo))[0];
  } else {
    inserOrUpdate = (
      await UserModel.updateVerifyCodeForLoginUser(accountInfo)
    )[0];
  }
  if (!inserOrUpdate) {
    throw new Error(message.UPDATE_FAIL);
  }
  return inserOrUpdate;
};

//Update
const updateUser = async (userInfo: any, requestUser: IRequestingUser) => {
  const { email_address, phone_nbr, user_nme } = userInfo;
  if (_.isEmpty(email_address) && _.isEmpty(phone_nbr)) {
    throw new Error(message.INVALID_INPUT);
  }
  // TODO: user_name should replace all special characters.
  // TODO: check email and phone number is working.
  if (!_.isUndefined(user_nme) && _.isEmpty(user_nme)) {
    throw new Error(message.NAME_SHOULD_NOT_NULL);
  }
  if (email_address) {
    if (!validator.isEmail(email_address)) {
      throw new Error(message.WRONG_EMAIL_FORMAT);
    }
    const checkEmailResult = await UserModel.findOtherUsersByAccount(
      { email_address },
      requestUser.user_id,
    );
    if (checkEmailResult) {
      throw new Error(message.EMAIL_EXIST);
    }
  }
  if (phone_nbr) {
    if (!validator.isMobilePhone(`${phone_nbr}`, 'zh-CN')) {
      throw new Error(message.WRONG_PHONE_NBR_FORMAT);
    }
    const checkPhoneNbrResult = await UserModel.findOtherUsersByAccount(
      { phone_nbr },
      requestUser.user_id,
    );

    if (checkPhoneNbrResult) {
      throw new Error(message.PHONE_NBR_EXIST);
    }
  }
  const updateResult = await UserModel.updateUserInfo(
    userInfo,
    requestUser.user_id,
  );
  return updateResult[0];
};

export const UserService: any = {
  me,
  searchUsersByName,
  verifyCode,
  login,
  updateUser,
};
