import { PaginateInput } from '@app/shared/models/paginate.input';

export class FindUsersInput extends PaginateInput {
  constructor(input: { page?: number; perPage?: number }) {
    super();

    if (input.page !== undefined) {
      this.page = input.page;
    }

    if (input.perPage !== undefined) {
      this.perPage = input.perPage;
    }
  }
}
