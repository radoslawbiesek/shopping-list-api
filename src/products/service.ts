import { CreateProductDto } from './dto';
import { ProductsQueryParams } from './query-params';
import { productsRepository, Product } from './repository';

export const productsService = { getAll, create };

async function create(userId: number, createProductDto: CreateProductDto): Promise<Product> {
  return productsRepository.create({
    created_by: userId,
    ...createProductDto,
  });
}

async function getAll(userId: number, queryParams: ProductsQueryParams) {
  return productsRepository.getAll(userId, queryParams);
}
