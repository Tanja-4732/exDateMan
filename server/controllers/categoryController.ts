import { Category } from "../models/categoryModel";
import { getManager, EntityManager } from "typeorm";

export default class CategoryController {
  public static async getCategoryByIdOrFail(categoryId: number): Promise<Category> {
    // Get the entity manager
    const entityManager: EntityManager = getManager();

    try {
      await entityManager.findOneOrFail(Category, categoryId);
    } catch (error) {
      throw new Error("Can't find category");
    }
  }
}
