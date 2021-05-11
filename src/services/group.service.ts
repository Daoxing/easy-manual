import { GroupModel } from '../models/group.model';
import { IOrder, IPage, IUser } from '../types';

const getGroupsForUser = (userId: string, sort: IOrder, page: IPage) => {
  return GroupModel.getGroupsForUser(userId, sort, page);
};
const getGroupsForUserCount = (userId: string) => {
  return GroupModel.getGroupsCountForUser(userId);
};
export const GroupService: any = {
  getGroupsForUser,

  getGroupsForUserCount,
};
