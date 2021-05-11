import { IOrder, IPage } from '../types';

export const specialRegex =
  '/\\|/|?|？|*|"|“|”|\'|‘|’|<|>|{|}|[|]|【|】|：|:|、|^|$|!|~|`||/g';

export const defaultSort: IOrder = {
  field: 'created_tms',
  order: 'ASC',
};

export const defaultPage: IPage = {
  pageNo: 1,
  pageCount: 10,
};
