import type { PaginatedResultInterface } from '../interfaces/paginated-result.interface';

interface PrismaPaginateOptions<
  Item,
  Domain,
  Where = unknown,
  Order = unknown,
  Include = unknown,
  Select = unknown,
> {
  page: number;
  perPage: number;
  where?: Where;
  orderBy?: Order;
  include?: Include;
  select?: Select;
  mapItem?: (item: Item) => Domain;
}

export async function prismaPaginate<
  Item,
  Domain = Item,
  Where = unknown,
  Order = unknown,
  Include = unknown,
  Select = unknown,
>(
  modelDelegate: {
    findMany(args: {
      where?: Where;
      skip: number;
      take: number;
      orderBy?: Order;
      include?: Include;
      select?: Select;
    }): Promise<Item[]>;
    count(args: { where?: Where }): Promise<number>;
  },
  options: PrismaPaginateOptions<Item, Domain, Where, Order, Include, Select>,
): Promise<PaginatedResultInterface<Domain>> {
  const { page = 1, perPage = 10, where, orderBy, include, select, mapItem } = options;

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

  const mappedItems = mapItem ? items.map((item) => mapItem(item)) : (items as unknown as Domain[]);

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
