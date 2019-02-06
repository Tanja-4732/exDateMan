import { Router } from "express";
import CategoryController from '../../../controllers/categoryController';

const categoriesRoutes: Router = Router();

// Get all categories
categoriesRoutes.get("/", CategoryController.getAllCategories);

// Get one category
categoriesRoutes.get("/:categoryId", CategoryController.getCategory);

// Create category
categoriesRoutes.post("/", CategoryController.createCategory);

// Update category
categoriesRoutes.put("/:categoryId", CategoryController.updateCategory);

// Delete Category
categoriesRoutes.delete("/:categoryId", CategoryController.deleteCategory)

export default categoriesRoutes;
