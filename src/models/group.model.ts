import {
  defaultPage,
  defaultSort,
  TABLE_GROUP,
  TABLE_USER_IN_GROUP,
} from '../constants';
import { DBconnection } from '../database';
import { IOrder, IPage } from '../types';

// Query
const getGroupById = (groupId: string) => {
  return DBconnection(TABLE_GROUP)
    .select('*')
    .where({ group_id: groupId })
    .first();
};

// Find my groups
const getGroupsForUser = (userId: string, order: IOrder, page: IPage) => {
  order = order ? order : defaultSort;
  page = page ? page : defaultPage;
  return DBconnection.select('group.*')
    .from(TABLE_GROUP)
    .leftJoin(
      TABLE_USER_IN_GROUP,
      `${TABLE_GROUP}.group_id`,
      `${TABLE_USER_IN_GROUP}.group_id`,
    )
    .where({ user_id: userId, approved: true })
    .orderBy(order.field, order.order)
    .limit(page.pageCount)
    .offset(page.pageCount * (page.pageNo - 1));
};

const getGroupsCountForUser = async (userId: string) => {
  const res = await DBconnection.from(TABLE_GROUP)
    .leftJoin(
      TABLE_USER_IN_GROUP,
      `${TABLE_GROUP}.group_id`,
      `${TABLE_USER_IN_GROUP}.group_id`,
    )
    .where({ user_id: userId, approved: true })
    .count();

  return res[0].count;
};
const isJoinedGroup = async (groupId: string, userId: string) => {
  return DBconnection(TABLE_USER_IN_GROUP)
    .select('*')
    .where({ group_id: groupId, user_id: userId })
    .first();
};
const removeUserFromGroup = async (groupId: string, userId: string) => {
  return DBconnection(TABLE_USER_IN_GROUP)
    .where({
      user_id: userId,
      group_id: groupId,
    })
    .delete()
    .limit(1)
    .returning('*');
};
export const GroupModel = {
  getGroupById,
  getGroupsForUser,
  getGroupsCountForUser,
  isJoinedGroup,
  removeUserFromGroup,
};
