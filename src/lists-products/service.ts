import { CreateListProductDto } from './dto';
import { listsProductsRepository } from './repository';

export const listsProductsService = { create, getAll };

async function create(userId: number, listId: number, createListProductDto: CreateListProductDto) {
  return listsProductsRepository.create(userId, listId, createListProductDto);
}

async function getAll(userId: number, listId: number) {
  return listsProductsRepository.getAll(userId, listId);
}
