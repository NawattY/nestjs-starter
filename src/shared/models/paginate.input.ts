import { DEFAULT_PAGINATION } from '@app/constants/pagination.constant';

export class PaginateInput {
  page: number = DEFAULT_PAGINATION.PAGE;
  perPage: number = DEFAULT_PAGINATION.LIMIT;
}
