import { CreateProductDto } from './dto';
import { productsRepository, Product } from './repository';

async function createProduct(userId: number, createProductDto: CreateProductDto): Promise<Product> {
  return productsRepository.createProduct({
    created_by: userId,
    ...createProductDto,
  });
}

export const productsService = { createProduct };
