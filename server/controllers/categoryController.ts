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
  static async setCategoryInResDotLocals(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      res.locals.category = await CategoryController.getCategoryByNoAndInvOrFail(
        req.params.categoryNo,
        res.locals.inventory
      );
      // TODO maybe remove this; this may cause bugs
      res.locals.category.Inventory = res.locals.inventory;
      log("The inventory id is:" + (res.locals.inventory as Inventory).InventoryId);
    } catch (error) {
      log(error);
      res.status(404).json({
        status: 404,
        error: "Specified category couldn't be found."
      });
      return;
    }
    next();
  }

  static async getCategory(req: Request, res: Response): Promise<any> {
    // const entityManager: EntityManager = getManager();

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

  static async getAllCategories(req: Request, res: Response): Promise<any> {
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

    let cats: Category[] = [];
    try {
      cats = await entityManager.find(Category, {
        where: {
          Inventory: res.locals.inventory as Inventory
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: "Something went wrong server-side."
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: "Retrieved all categories for this inventory",
      // inventoryId: (res.locals.inventory as Inventory).InventoryId,
      categories: cats
    });
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
    // TODO check if category is form this inventory

    // Attempt deletion
    try {
      log("Removing...");
      log(res.locals.category.name);
      // await entityManager.remove(Category, res.locals.category);
      log(
        "Object to remove:\n" +
          JSON.stringify(
            {
              category: (res.locals.category as Category),
              // number: (res.locals.category as Category).number,
              // Inventory: (res.locals.category as Category).Inventory.InventoryId, // TODO // FIXME check for null
            },
            null,
            2
          )
      );
      await entityManager.delete(Category, {
        Inventory: (res.locals.category as Category).Inventory,
        number: (res.locals.category as Category).number
      });
      log("Removed");
    } catch (err) {
      log("Error in deleteCategory: \n" + err);
      // Report failure
      res.status(500).json({
        status: 500,
        error: "Something went wrong server-side."
      });
      return;
    }
    // Report success
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
      parent = await this.getCategoryByNoAndInvOrFail(
        (req.body as CategoryRequest).parent,
        res.locals.inventory
      );
      for (const catId of req.body.children) {
        children.push(
          await this.getCategoryByNoAndInvOrFail(catId, res.locals.inventory)
        );
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

    // Check if already present
    let goAhead: boolean = true as boolean;
    let temp: Category;
    try {
      temp = await CategoryController.getCategoryByNoAndInvOrFail(
        req.params.categoryNo as number,
        res.locals.inventory as Inventory
      );
    } catch (error) {
      log(error);
    }
    if (temp != null) {
      goAhead = false;
    }

    if (!goAhead) {
      res.status(409).json({
        status: 409,
        error: "Category with specified number already exists."
      });
      return;
    }

    // Create category object and set values
    const category: Category = new Category();
    category.Inventory = res.locals.inventory as Inventory;
    category.name = (req.body as CategoryRequest).name;
    category.number = req.params.categoryNo;
    category.childCategories = [];
    try {
      log("Entered try block");
      // Check if children are specified
      if ((req.body as CategoryRequest).children != null) {
        // Iterate over the specified children and add them to the new object
        for (const categoryNo of (req.body as CategoryRequest).children) {
          category.childCategories.push(
            await CategoryController.getCategoryByNoAndInvOrFail(
              categoryNo,
              res.locals.inventory
            )
          );
        }
      }
      log("After first if"); // TODO remove debug
      // Check if a parent is specified
      if ((req.body as CategoryRequest).parent == null) {
        log("No parent specified.");
        // // Set parent to self
        // category.parentCategory = req.params.categoryNo;
        // Set parent to null
        category.parentCategory = null;
      } else {
        // Set the specified parent
        log("Get parent category");
        category.parentCategory = await CategoryController.getCategoryByNoAndInvOrFail(
          (req.body as CategoryRequest).parent,
          res.locals.inventory
        );
        // Set this as the child of the parent
        category.parentCategory.childCategories.push(category);
        log("Got parent category: " + category.parentCategory.name);
      }
      log("Right before save");
      await entityManager.save(category);
    } catch (error) {
      log("Error in createCategory:\n" + error);
      res.status(404).json({
        status: 404,
        error: "Can't find specified categories"
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: "Category created"
    });
  }

  public static async getCategoryByNoAndInvOrFail(
    categoryNo: number,
    inventory: Inventory
  ): Promise<Category> {
    // Get the entity manager
    // const entityManager: EntityManager = getManager();
    log("Get category: " + categoryNo);
    try {
      return await getManager().findOneOrFail(Category, {
        where: {
          number: categoryNo,
          Inventory: inventory
        }
      });
    } catch (error) {
      // log("Error in getCategoryByNoAndInvOrFail: " + error);
      throw new Error("Can't find category where number=" + categoryNo
      + " and inventoryId=" + inventory.InventoryId);
    }
  }
}
