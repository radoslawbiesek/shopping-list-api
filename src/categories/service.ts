import { CreateCategoryDto } from './dto';
import { categoriesRepository } from './repository';

async function createCategory(
  userId: number,
  createCategoryDto: CreateCategoryDto,
) {
  return categoriesRepository.createCategory({
    created_by: userId,
    ...createCategoryDto,
  });
}

export const categoriesService = { createCategory };
