import { Injectable } from "@angular/core";
import { Category } from "src/app/models/category/category";
import { InventoryService } from "../inventory/inventory.service";
import {
  EventSourcingService,
  itemType
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
        // Subscribe to calls
        document.addEventListener(
          "new-category",
          (newCategoryEvent: CustomEvent) =>
            this.handleNewCategoryEvent(newCategoryEvent.detail),
          false
        );

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
    console.log("fetch all Stocks");

    // Wait for the other services to be ready
    await this.is.ready;
    await this.ess.ready;

    // Initialize the dict
    CategoryService.inventoryCategoriesProjection = {};

    // Iterate over the Inventories projection
    for (const inventoryUuid in this.is.inventories) {
      if (this.is.inventories.hasOwnProperty(inventoryUuid)) {
        // Initialize the dict for the Inventory
        CategoryService.inventoryCategoriesProjection[inventoryUuid] = {};

        // Iterate over the Things of the Inventory using the projections
        for (const thing of this.ts.things[inventoryUuid]) {
          // Initialize the Stocks array
          CategoryService.inventoryCategoriesProjection[inventoryUuid][
            thing.uuid
          ] = [];
        }
      }
    }

    // Iterate over all Inventory-UUIDs of the EventsLogs
    for (const inventoryEvents of EventSourcingService.events) {
      // Iterate over the Events of the Inventory
      for (const event of inventoryEvents.events) {
        // But only if when the Event is a StockEvent
        if (event.data.itemType === itemType.STOCK) {
          try {
            // Apply the Event
            await this.applyStockEvent(event);
          } catch (err) {
            // Ignore errors caused by deleted Things
          }
        }
      }
    }
  }
}
