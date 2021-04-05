import { TABLE_GROUP } from '../constants';
import { DBconnection } from '../database';

// Query
const getGroupById = (groupId: string) => {
  return DBconnection(TABLE_GROUP)
    .select('*')
    .where({ group_id: groupId })
    .first();
};

export const GroupModel = {
  getGroupById,
};
