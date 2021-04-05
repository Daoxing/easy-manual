import { TABLE_USER_IN_GROUP } from '../constants';
import { DBconnection } from '../database';

const getUserInGroup = (userId: string, groupId: string) => {
  return DBconnection(TABLE_USER_IN_GROUP)
    .select('*')
    .where({ group_id: groupId, user_id: userId })
    .first();
};

export const UserModel = {
  getUserInGroup,
};
