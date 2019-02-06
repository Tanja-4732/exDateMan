import { Category } from "../models/categoryModel";
import { getManager, EntityManager } from "typeorm";
import AuthController from "./authController";
import { InventoryUserAccessRightsEnum } from "../models/inventoryUserModel";
import { Request, Response } from "express";
import { Inventory } from "../models/inventoryModel";

interface CategoryRequest {
  name: string;
  parent: Category; // initially number
  children: Category[]; // initially number[]
}

export default class CategoryController {
  static getCategory(req: Request, res: Response): any {
    // TODO
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

  }

  static createCategory(req: Request, res: Response): any {
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
