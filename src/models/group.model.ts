import { TABLE_GROUP, TABLE_USER_IN_GROUP } from '../constants';
import { DBconnection } from '../database';

// Query
const getGroupById = (groupId: string) => {
  return DBconnection(TABLE_GROUP)
    .select('*')
    .where({ group_id: groupId })
    .first();
};

// Find my groups
const getGroupsForUser = (userId: string) => {
  return DBconnection.select('group.*')
    .from(TABLE_GROUP)
    .leftJoin(
      TABLE_USER_IN_GROUP,
      `${TABLE_GROUP}.group_id`,
      `${TABLE_USER_IN_GROUP}.group_id`,
    )
    .where({ user_id: userId, approved: true });
};

export const GroupModel = {
  getGroupById,
  getGroupsForUser,
};
