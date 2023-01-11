import { CreateProductDto, GetAllProductsQuery } from './dto';
import { productsRepository } from './repository';

export const productsService = { getAll, create };

async function create(userId: number, createProductDto: CreateProductDto) {
  return productsRepository.create({
    created_by: userId,
    ...createProductDto,
  });
}

async function getAll(userId: number, queryParams: GetAllProductsQuery) {
  return productsRepository.getAll(userId, queryParams);
}
