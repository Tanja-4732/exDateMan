import { Category } from "../models/categoryModel";
import { getManager, EntityManager } from "typeorm";
import AuthController from "./authController";
import { InventoryUserAccessRightsEnum } from "../models/inventoryUserModel";
import { Request, Response, NextFunction } from "express";
import { Inventory } from "../models/inventoryModel";
import { log } from "util";

interface CategoryRequest {
  name: string;
  parent: number;
  children: number[];
}

export default class CategoryController {
  /**
   * Sets the category in the res.locals.category field
   */
  static async setCategoryInResDotLocals(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      res.locals.inventory = await this.getCategoryByIdOrFail(
        req.params.categoryId
      );
    } catch (error) {
      res.status(404).json({
        status: 404,
        error: "Inventory " + req.params.inventoryId + " couldn't be found."
      });
    }
    log("Parsed inv id: " + res.locals.inventory.InventoryId);
    next();
  }

  static async getCategory(req: Request, res: Response): Promise<any> {
    const entityManager: EntityManager = getManager();

    // Check for authorization
    if (
      !(await AuthController.isAuthorized(
        res.locals.actingUser,
        res.locals.inventory as Inventory,
        InventoryUserAccessRightsEnum.READ
      ))
    ) {
      res.status(403).json({
        status: 403,
        error:
          "Requestor doesn't have the READ role or higher for this inventory."
      });
      return;
    }

    // Write the child categories as numbers in an array // TODO maybe change to let
    const childrenNumbers: number[] = [];
    try {
      for (const cat of (res.locals.category as Category).childCategories) {
        childrenNumbers.push(cat.number);
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: "Something went wrong server-side."
      });
      return;
    }

    // Get category
    res.status(200).json({
      status: 200,
      message: "Found one category.",
      category: {
        number: (res.locals.category as Category).number,
        name: (res.locals.category as Category).name,
        parent: (res.locals.category as Category).parentCategory.number,
        children: childrenNumbers
      }
    });
  }

  static getAllCategories(req: Request, res: Response): any {
    // TODO
  }

  static async deleteCategory(req: Request, res: Response): Promise<any> {
    const entityManager: EntityManager = getManager();

    // Check for authorization
    if (
      !(await AuthController.isAuthorized(
        res.locals.actingUser,
        res.locals.inventory as Inventory,
        InventoryUserAccessRightsEnum.WRITE
      ))
    ) {
      res.status(403).json({
        status: 403,
        error:
          "Requestor doesn't have the WRITE role or higher for this inventory."
      });
      return;
    }

    try {
      entityManager.remove(res.locals.category);
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: "Something went wrong server-side."
      });
      return;
    }
    res.status(200).json({
      status: 200,
      message: "Deleted category"
    });
  }

  static async updateCategory(req: Request, res: Response): Promise<any> {
    const entityManager: EntityManager = getManager();

    // Check for authorization
    if (
      !(await AuthController.isAuthorized(
        res.locals.actingUser,
        res.locals.inventory as Inventory,
        InventoryUserAccessRightsEnum.WRITE
        ))
        ) {
          res.status(403).json({
            status: 403,
            error:
            "Requestor doesn't have the WRITE role or higher for this inventory."
          });
          return;
        }

    // Get the category to be updated
    const catToUpdate: Category = res.locals.category;

    // Get the data needed from req.body
    let parent: Category;
    const children: Category[] = [];
    try {
      parent = await this.getCategoryByIdOrFail((req.body as CategoryRequest).parent);
      for (const catId of req.body.children) {
        children.push(await this.getCategoryByIdOrFail(catId));
      }
    } catch (err) {
      res.status(404).json({
        status: 404,
        error: "The requested categories couldn't be found"
      });
      return;
    }

    // Set the requested values
    catToUpdate.parentCategory = parent;
    catToUpdate.childCategories = children;
    catToUpdate.name = (req.body as CategoryRequest).name;

    // Save the data
    try {
      entityManager.save(catToUpdate);
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: "Something went wrong server-side"
      });
      return;
    }
    res.status(200).json({
      status: 200,
      message: "Updated category"
    });
  }

  static async createCategory(req: Request, res: Response): Promise<any> {
    const entityManager: EntityManager = getManager();

    // Check for authorization
    if (
      !(await AuthController.isAuthorized(
        res.locals.actingUser,
        res.locals.inventory as Inventory,
        InventoryUserAccessRightsEnum.WRITE
      ))
    ) {
      res.status(403).json({
        status: 403,
        error:
          "Requestor doesn't have the WRITE role or higher for this inventory."
      });
      return;
    }
  }

  public static async getCategoryByIdOrFail(
    categoryId: number
  ): Promise<Category> {
    // Get the entity manager
    const entityManager: EntityManager = getManager();

    try {
      await entityManager.findOneOrFail(Category, categoryId);
    } catch (error) {
      throw new Error("Can't find category");
    }
  }
}
