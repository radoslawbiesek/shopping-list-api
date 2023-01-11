import { CreateCategoryDto } from './dto';
import { categoriesRepository } from './repository';

export const categoriesService = { create, getAll };

async function create(userId: number, createCategoryDto: CreateCategoryDto) {
  return categoriesRepository.create({
    created_by: userId,
    ...createCategoryDto,
  });
}

async function getAll(userId: number) {
  return categoriesRepository.getAll(userId);
}
