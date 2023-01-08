import { CreateProductDto } from './dto';
import { ProductsQueryParams } from './query-params';
import { productsRepository, Product } from './repository';

async function createProduct(userId: number, createProductDto: CreateProductDto): Promise<Product> {
  return productsRepository.createProduct({
    created_by: userId,
    ...createProductDto,
  });
}

async function getProducts(userId: number, queryParams: ProductsQueryParams) {
  return productsRepository.getProducts(userId, queryParams);
}

export const productsService = { createProduct, getProducts };
