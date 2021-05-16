import { GroupModel } from '../models/group.model';
import { IOrder, IPage, IUser } from '../types';

const getGroupsForUser = (userId: string, sort: IOrder, page: IPage) => {
  return GroupModel.getGroupsForUser(userId, sort, page);
};
const getGroupsForUserCount = (userId: string) => {
  return GroupModel.getGroupsCountForUser(userId);
};
const getGroupById = (groupId: string) => {
  return GroupModel.getGroupById(groupId);
};
const isJoinedGroup = (groupId: string, userId: string) => {
  return GroupModel.isJoinedGroup(groupId, userId);
};
export const GroupService: any = {
  getGroupsForUser,
  getGroupsForUserCount,
  getGroupById,
  isJoinedGroup,
};
