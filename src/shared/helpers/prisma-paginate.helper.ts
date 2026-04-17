import { PaginatedResultInterface } from '@app/shared/interfaces/paginated-result.interface';

interface PrismaPaginateOptions<Domain, Where = any, Order = any> {
  page: number;
  perPage: number;
  where?: Where;
  orderBy?: Order;
  include?: any; // Prisma.XInclude
  select?: any;  // Prisma.XSelect
  entity?: new (domain: Domain) => any;
}

export async function prismaPaginate<Domain>(
  modelDelegate: {
    findMany: Function;
    count: Function;
  },
  options: PrismaPaginateOptions<Domain>,
): Promise<PaginatedResultInterface<any>> {
  const { page = 1, perPage = 10, where, orderBy, include, select, entity } = options;

  const skip = (page - 1) * perPage;
  const take = perPage;

  const [items, totalItems] = await Promise.all([
    modelDelegate.findMany({
      where,
      skip,
      take,
      orderBy,
      include,
      select,
    }),
    modelDelegate.count({ where }),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  const mappedItems = entity
    ? items.map((item: any) => new entity(item))
    : items;

  return {
    items: mappedItems,
    meta: {
      totalItems,
      itemCount: mappedItems.length,
      itemsPerPage: perPage,
      totalPages,
      currentPage: page,
    },
  };
}
