import { TABLE_USER, TABLE_USER_IN_GROUP } from '../constants';
import { DBconnection } from '../database';
import {
  LoginByEmail,
  LoginByPhoneNbr,
  NewUser,
  UpdateUserInfo,
} from '../types';
import { generateRandomDigitalNumbers } from '../utils';

const getUserInGroup = (userId: string, groupId: string) => {
  return DBconnection.select(`${TABLE_USER}.*`)
    .from(TABLE_USER_IN_GROUP)
    .leftJoin(
      TABLE_USER,
      `${TABLE_USER_IN_GROUP}.user_id`,
      `${TABLE_USER}.user_id`,
    )
    .where({ group_id: groupId, user_id: userId })
    .first();
};

const findUsersInGroupByName = (name: string, groupId: string) => {
  return DBconnection.select(`${TABLE_USER}.*`)
    .from(TABLE_USER_IN_GROUP)
    .leftJoin(
      TABLE_USER,
      `${TABLE_USER_IN_GROUP}.user_id`,
      `${TABLE_USER}.user_id`,
    )
    .where({ group_id: groupId })
    .andWhereRaw(`POSITION( LOWER(${name}) IN LOWER(${TABLE_USER}.user_nme))>0`)
    .orderBy(`${TABLE_USER}.user_nme`, 'asc');
};

const findUserById = async (userId: string) => {
  return DBconnection(TABLE_USER)
    .where({ user_id: userId })
    .select('*')
    .first();
};

const findUsersByNames = (name: string) => {
  return DBconnection.select('*')
    .from(TABLE_USER)
    .whereRaw(`POSITION( LOWER(${name}) IN LOWER(user_nme))>0`)
    .orderBy(`user_nme`, 'asc');
};

const verifyCode = (userId: string, code: string) => {
  return DBconnection(TABLE_USER)
    .where({ user_id: userId, verify_code: code })
    .select('*')
    .first();
};

const clearVerifyCode = (userId: string, code: string) => {
  const codeUpdate = {
    verify_code: null,
    verify_code_created_tms: null,
  };
  return DBconnection(TABLE_USER)
    .where({ user_id: userId, verify_code: code })
    .update(codeUpdate)
    .returning('*');
};

const findLoginUser = (accountInfo: LoginByEmail | LoginByPhoneNbr) => {
  return DBconnection(TABLE_USER).where(accountInfo).select('*').first();
};

const findOtherUsersByAccount = (
  accountInfo: LoginByEmail | LoginByPhoneNbr,
  requestUserId: string,
) => {
  return DBconnection(TABLE_USER)
    .where(accountInfo)
    .andWhereNot({ user_id: requestUserId })
    .select('*')
    .first();
};

const updateUserInfo = (userInfo: UpdateUserInfo, requestUserId: string) => {
  return DBconnection(TABLE_USER)
    .where({ user_id: requestUserId })
    .update(userInfo)
    .returning('*');
};

const insertUser = (accountInfo: NewUser) => {
  return DBconnection(TABLE_USER).insert(accountInfo).returning('*');
};

const updateVerifyCodeForLoginUser = (
  accountInfo: LoginByEmail | LoginByPhoneNbr,
) => {
  const phoneNbrCodeUpdate = {
    verify_code: generateRandomDigitalNumbers(6),
    verify_code_created_tms: new Date(),
  };
  return DBconnection(TABLE_USER)
    .where(accountInfo)
    .update(phoneNbrCodeUpdate)
    .returning('*');
};

export const UserModel = {
  getUserInGroup,
  findUserById,
  findUsersInGroupByName,
  findUsersByNames,
  verifyCode,
  clearVerifyCode,
  findLoginUser,
  findOtherUsersByAccount,
  insertUser,
  updateVerifyCodeForLoginUser,
  updateUserInfo,
};
