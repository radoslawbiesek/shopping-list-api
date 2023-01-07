import { CreateCategoryDto } from './dto';
import { categoriesRepository } from './repository';

async function createCategory(userId: number, createCategoryDto: CreateCategoryDto) {
  return categoriesRepository.createCategory({
    created_by: userId,
    ...createCategoryDto,
  });
}

async function getAllCategories(userId: number) {
  return categoriesRepository.getAllCategories(userId);
}

export const categoriesService = { createCategory, getAllCategories };
