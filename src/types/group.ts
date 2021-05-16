export enum IjoinGroupStatusEnum {
  NOT_JOINED = 'not_joined',
  APPLIED = 'applied',
  JOINED = 'joined',
}
export interface IGroup {
  group_id: string;
  group_nme?: string;
  group_intro?: string;
}
