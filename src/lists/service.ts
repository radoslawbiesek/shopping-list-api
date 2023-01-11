import { CreateListDto } from './dto';
import { listsRepository } from './repository';

export const listsService = { getAll, create };

async function create(userId: number, createListDto: CreateListDto) {
  return listsRepository.create(userId, createListDto);
}

async function getAll(userId: number) {
  return listsRepository.getAll(userId);
}
