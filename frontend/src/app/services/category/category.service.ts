import { Injectable } from "@angular/core";
import { Category } from "src/app/models/category/category";
import { InventoryService } from "../inventory/inventory.service";
import {
  EventSourcingService,
  itemType,
  Event,
  crudType
} from "../EventSourcing/event-sourcing.service";
import { AuthService } from "../auth/auth.service";
import { StockService } from "../stock/stock.service";

@Injectable({
  providedIn: "root"
})
export class CategoryService {
  /**
   * The current state of Categories of all Inventories
   *
   * (a projection from the event logs)
   */
  private static inventoryCategoriesProjection: {
    [inventoryUuid: string]: Category[];
  };

  /**
   * The Categories projection
   *
   * Usage:
   * `[inventoryUuid][thingUuid]`
   */
  get categories() {
    return CategoryService.inventoryCategoriesProjection;
  }

  /**
   * Sneaky stuff
   *
   * Used to get around the "no async constructors" limitation
   */
  public ready: Promise<any>;

  constructor(
    private is: InventoryService,
    private ess: EventSourcingService,
    private as: AuthService
  ) {
    // Ready declaration
    this.ready = new Promise((resolve, reject) => {
      if (CategoryService.inventoryCategoriesProjection == null) {
        this.fetchAllInventoryCategories().then(result => {
          // Mark as ready
          resolve(null);
        });
      } else {
        // Mark as ready
        resolve(null);
      }
    });
  }

  /**
   * Iterates over all Inventories and their Things and fetches their Stocks
   */
  private async fetchAllInventoryCategories() {
    console.log("fetch all Categories");

    // Wait for the other services to be ready
    await this.is.ready;
    await this.ess.ready;

    // Initialize the dict
    CategoryService.inventoryCategoriesProjection = {};

    // Iterate over the Inventories projection
    for (const inventoryUuid in this.is.inventories) {
      if (this.is.inventories.hasOwnProperty(inventoryUuid)) {
        // Initialize the outer array for the Inventory
        CategoryService.inventoryCategoriesProjection[inventoryUuid] = [];
      }
    }

    // Iterate over all Inventory-UUIDs of the EventsLogs
    for (const inventoryEvents of EventSourcingService.events) {
      // Iterate over the Events of the Inventory
      for (const event of inventoryEvents.events) {
        // But only if when the Event is a CategoryEvent
        if (event.data.itemType === itemType.CATEGORY) {
          try {
            // Apply the Event
            await this.applyCategoryEvent(event);
          } catch (err) {
            // Ignore errors caused by deleted Things
          }
        }
      }
    }
  }

  /**
   * Modifies the current Category projection by applying an event
   *
   * This does not modify any stored data
   */
  private async applyCategoryEvent(categoryEvent: Event) {
    await this.is.ready;

    // TODO delete this field ("const addedOn")
    /**
     * One date representing now
     */
    const addedOn = new Date();

    const newCategory = {
      name: categoryEvent.data.categoryData.name,
      uuid: categoryEvent.data.uuid,
      parentUuid: categoryEvent.data.categoryData.parentUuid,
      createdOn: categoryEvent.data.categoryData.createdOn,
      children: []
    } as Category;

    console.log("This is the categoriesProjection");
    console.log(CategoryService.inventoryCategoriesProjection);

    /**
     * The Category of the event in the projection, if any
     */
    const existingCategory = this.getCategoryByUuid(
      categoryEvent.inventoryUuid,
      categoryEvent.data.uuid
    );

    switch (categoryEvent.data.crudType) {
      case crudType.DELETE:
        // Avoid deleting what doesn't exist
        if (existingCategory != null) {
          throw new Error("The category does not exist");
        }

        // Check if the Category is top-level
        if (
          existingCategory.parentUuid == null ||
          existingCategory.parentUuid === ""
        ) {
          // Find the index of the Category
          const index = CategoryService.inventoryCategoriesProjection[
            categoryEvent.inventoryUuid
          ].findIndex(c => c.uuid === categoryEvent.data.uuid);

          // Remove a category from the projection
          CategoryService.inventoryCategoriesProjection[
            categoryEvent.inventoryUuid
          ].splice(index, 1);
        } else {
          // Find the index of the Category
          const index = this.getCategoryByUuid(
            categoryEvent.inventoryUuid,
            categoryEvent.data.categoryData.parentUuid
          ).children.findIndex(c => c.uuid === categoryEvent.data.uuid);

          // Remove a category from the projection
          CategoryService.inventoryCategoriesProjection[
            categoryEvent.inventoryUuid
          ].splice(index, 1);
        }
        break;

      case crudType.CREATE:
        // Check, if th parent UUID is null
        if (existingCategory == null) {
          throw new Error("The category does not exist");
        }

        // Check if the Category should be top-level
        if (
          categoryEvent.data.categoryData.parentUuid == null ||
          categoryEvent.data.categoryData.parentUuid === ""
        ) {
          CategoryService.inventoryCategoriesProjection[
            categoryEvent.inventoryUuid
          ].push(newCategory);
        } else {
          // Push to the parent Category
          this.getCategoryByUuid(
            categoryEvent.inventoryUuid,
            categoryEvent.data.categoryData.parentUuid
          ).children.push(newCategory);
        }

        // Add the Category to its parent

        // Push a new Stock onto the Projection
        CategoryService.inventoryCategoriesProjection[
          categoryEvent.inventoryUuid
        ][categoryEvent.data.stockData.thingUuid].push(newCategory);
        break;
      case crudType.UPDATE:
        // Update a Stock already included in the projection

        // Remove immutable values
        delete newCategory.uuid;
        delete newCategory.createdOn;

        // Delete all null values
        Object.keys(newCategory).forEach(
          key => newCategory[key] == null && delete newCategory[key]
        );

        // Assign the changed values
        // TODO check if this works (update category)
        Object.assign(existingCategory, newCategory);
        break;
    }
  }

  /**
   * Recursively finds and returns a category from the projection
   *
   * @param uuid The UUID of the Category to be found
   */
  public getCategoryByUuid(
    inventoryUuid: string,
    categoryUuid: string
  ): Category {
    for (const c of CategoryService.inventoryCategoriesProjection[
      inventoryUuid
    ]) {
      const result = this.getCategoryByUuidRecursive(c, categoryUuid);
      if (result != null) {
        return result;
      }
    }

    // If the category could not be found, return null
    return null;
  }

  /**
   * The recursive implementation of the Category search
   *
   * @param baseCategory The category on which to start the search
   * @param targetCategoryUuid The category UUID to search for
   *
   * @returns The category to search for, null if not found
   */
  private getCategoryByUuidRecursive(
    baseCategory: Category,
    targetCategoryUuid: string
  ): Category {
    // Check if this is the right category
    if (baseCategory.uuid === targetCategoryUuid) {
      return baseCategory;
    }

    // If the UUID doesn't match, continue searching
    for (const c of baseCategory.children) {
      // Make a recursive call with the child
      const result = this.getCategoryByUuidRecursive(c, targetCategoryUuid);

      // If the recursive call was successful, return the result
      if (result !== null) {
        return result;
      }

      // If nothing was found return null
      return null;
    }
  }
}
