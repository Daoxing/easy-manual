import { GroupModel } from '../models/group.model';
import { IUser } from '../types';

const getGroupsForUser = (requestingUser: IUser) => {
  return GroupModel.getGroupsForUser(requestingUser.user_id);
};

export const GroupService: any = {
  getGroupsForUser,
};
