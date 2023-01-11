import { GetAllProductsQuery } from './dto';
import { _createGetProductsQuery } from './repository';

const USER_ID = 1;

describe('_createGetProductsQuery helper function', () => {
  it('creates a valid sql query for all possible params', () => {
    const params: GetAllProductsQuery = {
      search: 'test',
      category_id: '2',
      order_by: '-name',
      offset: '20',
      limit: '10',
    };
    const [query, values] = _createGetProductsQuery(USER_ID, params);
    expect(query).toMatchInlineSnapshot(
      `"SELECT * FROM products WHERE created_by = $1 AND CONCAT(name, description) ILIKE $2 AND category_id = $3 ORDER BY $4 LIMIT $5 OFFSET $6"`,
    );
    expect(values).toEqual([
      USER_ID,
      `%${params.search}%`,
      params.category_id,
      `name DESC`,
      params.limit,
      params.offset,
    ]);
  });

  it('creates a valid sql query for selected params', () => {
    const params: GetAllProductsQuery = {
      category_id: '2',
      order_by: 'name',
      limit: '10',
    };
    const [query, values] = _createGetProductsQuery(USER_ID, params);
    expect(query).toMatchInlineSnapshot(
      `"SELECT * FROM products WHERE created_by = $1 AND category_id = $2 ORDER BY $3 LIMIT $4"`,
    );
    expect(values).toEqual([USER_ID, params.category_id, `name ASC`, params.limit]);
  });

  it('creates a valid sql query for search only', () => {
    const params: GetAllProductsQuery = {
      search: 'test',
    };
    const [query, values] = _createGetProductsQuery(USER_ID, params);
    expect(query).toMatchInlineSnapshot(
      `"SELECT * FROM products WHERE created_by = $1 AND CONCAT(name, description) ILIKE $2"`,
    );
    expect(values).toEqual([USER_ID, `%${params.search}%`]);
  });
});
