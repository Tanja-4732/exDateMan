import { Router } from "express";
import CategoryController from '../../../controllers/categoryController';

const categoriesRoutes: Router = Router();

// Create category
categoriesRoutes.post("/:categoryNo", CategoryController.createCategory);

// Set category
categoriesRoutes.use(
  "/:categoryNo",
  CategoryController.setCategoryInResDotLocals
);

// Get all categories
categoriesRoutes.get("/", CategoryController.getAllCategories);

// Get one category
categoriesRoutes.get("/:categoryNo", CategoryController.getCategory);

// Update category
categoriesRoutes.put("/:categoryNo", CategoryController.updateCategory);

// Delete Category
categoriesRoutes.delete("/:categoryNo", CategoryController.deleteCategory);

export default categoriesRoutes;
