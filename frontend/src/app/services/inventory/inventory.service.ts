import { Injectable } from "@angular/core";
import { Inventory } from "../../models/inventory/inventory";
import {
  EventSourcingService,
  crudType,
  itemType,
  Event
} from "../EventSourcing/event-sourcing.service";
import { v4 } from "uuid";
import { AuthService } from "../auth/auth.service";
import { AsyncConstructor } from "../../interfaces/async-constructor";

/**
 * This Service parses and projects inventory events.
 *
 * This class needs to await async operations before it can be used, but
 * TypeScript does not support await to be used in constructors, so the user
 * has to await the ready promise of this class.
 */
@Injectable({
  providedIn: "root"
})
export class InventoryService implements AsyncConstructor {
  constructor(private ess: EventSourcingService, private as: AuthService) {
    this.prepare();
  }

  /**
   * Public accessor for the inventories projection
   */
  get inventories(): { [uuid: string]: Inventory } {
    return InventoryService.inventoriesProjection;
  }

  /**
   * The current state of inventories (a projection from the event logs)
   */
  private static inventoriesProjection: { [uuid: string]: Inventory };

  /**
   * Sneaky stuff
   *
   * Used to get around the "no async constructors" limitation
   */
  public ready: Promise<null>;

  /**
   * Prepares this class for operaton and resolves the ready promise when done
   */
  private prepare() {
    // Ready declaration
    this.ready = new Promise((resolve, reject) => {
      if (InventoryService.inventoriesProjection == null) {
        this.fetchInventoryEvents().then(result => {
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
   * Re-fetches all events from the EventSourcingService
   */
  public async reFetchAll(): Promise<void> {
    await this.ess.reFetchAll();
    await this.fetchInventoryEvents();
  }

  /**
   * Obtains the inventories event log from the db and parses them
   */
  private async fetchInventoryEvents() {
    // Initialize the inventory projection dictionary
    InventoryService.inventoriesProjection = {};

    // Wait for EventSourcingService to be ready
    await this.ess.ready;

    // Iterate over all event logs
    for (const eventLog of EventSourcingService.eventsProjection) {
      // Iterate over the events in the log
      for (const event of eventLog.events) {
        // Check if the event is about an inventory
        if (event.data.itemType === itemType.INVENTORY) {
          // Update the inventories projection according to the event
          this.updateInventoriesProjection(event);
        }
      }
    }
  }

  /**
   * Updates the inventories projection, one event at a time
   *
   * @param event The event to be used to update the projection with
   */
  private updateInventoriesProjection(event: Event): Inventory {
    /**
     * The inventory to be created or updated (ignored for delete events)
     */
    const newInventory = {
      uuid: event.data.uuid,
      name: event.data.inventoryData.name,
      createdOn: event.data.inventoryData.createdOn,
      ownerUuid: event.data.inventoryData.ownerUuid,
      adminUuids: event.data.inventoryData.adminsUuids,
      writableUuids: event.data.inventoryData.WritablesUuids,
      readableUuids: event.data.inventoryData.readablesUuids
    };

    // Find the right CRUD operation
    switch (event.data.crudType) {
      case crudType.CREATE:
        // Assign a new inventory to the dictionary
        InventoryService.inventoriesProjection[
          event.inventoryUuid
        ] = newInventory;

        // Return the new inventory
        return newInventory;

      case crudType.UPDATE:
        // Remove immutable values
        delete newInventory.uuid;
        delete newInventory.createdOn;

        // Delete all null values
        Object.keys(newInventory).forEach(
          key => newInventory[key] == null && delete newInventory[key]
        );

        // Assign the changed values
        Object.assign(
          InventoryService.inventoriesProjection[event.inventoryUuid],
          newInventory
        );

        // Return the updated inventory
        return InventoryService.inventoriesProjection[event.inventoryUuid];

      case crudType.DELETE:
        // Delete the inventory
        delete InventoryService.inventoriesProjection[event.inventoryUuid];

        // Return nothing (the inventory is gone)
        return null;
    }

    // throw new Error("Method not implemented."); // TODO implement inventories projection
  }

  /**
   * Creates an inventory by generating and issuing an appropriate event
   *
   * @param name The name of the new inventory
   * @returns The uuid of the new inventory
   */
  async createInventory(name: string): Promise<Inventory> {
    /**
     * The uuid for the new inventory
     */
    const newUuid = v4();

    /**
     * The uuid of the user
     */
    const myUuid = (await this.as.getCurrentUser()).user.uuid;

    /**
     * The current date (and time)
     */
    const currentDate = new Date();

    const createInventoryEvent = {
      inventoryUuid: newUuid,
      date: currentDate,
      data: {
        crudType: crudType.CREATE,
        itemType: itemType.INVENTORY,
        uuid: newUuid,
        userUuid: myUuid,
        // Core data
        inventoryData: {
          name,
          createdOn: currentDate,
          ownerUuid: myUuid,
          adminsUuids: [],
          WritablesUuids: [],
          readablesUuids: []
        }
      }
    };

    // Append to the event log
    await this.ess.appendEventToInventoryLog(createInventoryEvent);

    // Update the inventories projection
    return this.updateInventoriesProjection(createInventoryEvent);
  }

  /**
   * Updates the data of an inventory by generating and issuing an appropriate event
   *
   * @param inventory The inventory to be updated
   */
  async updateInventory(inventory: Inventory): Promise<Inventory> {
    // TODO implement access rights #91

    /**
     * The uuid of the user
     */
    const myUuid = (await this.as.getCurrentUser()).user.uuid;

    // Create an inventory updated event
    const updateInventoryEvent = {
      // Event metadata
      inventoryUuid: inventory.uuid,
      date: new Date(),
      data: {
        // Generic data
        crudType: crudType.UPDATE,
        itemType: itemType.INVENTORY,
        uuid: inventory.uuid,
        userUuid: myUuid,
        // Core data
        inventoryData: {
          name: inventory.name,
          ownerUuid: inventory.ownerUuid,
          adminsUuids: inventory.adminUuids,
          WritablesUuids: inventory.writableUuids,
          readablesUuids: inventory.readableUuids
        }
      }
    } as Event;

    // Append to the event log
    await this.ess.appendEventToInventoryLog(updateInventoryEvent);

    // Update the inventories projection
    return this.updateInventoriesProjection(updateInventoryEvent);
  }

  /**
   * Updates the data of an inventory by generating and issuing an appropriate event
   *
   * @param inventory The inventory to be deleted
   */
  async deleteInventory(inventory: Inventory): Promise<Inventory> {
    /**
     * The uuid of the user
     */
    const myUuid = (await this.as.getCurrentUser()).user.uuid;

    // Create an inventory deleted event
    const deleteInventoryEvent = {
      // Event metadata
      inventoryUuid: inventory.uuid,
      date: new Date(),
      data: {
        // Generic data
        crudType: crudType.DELETE,
        itemType: itemType.INVENTORY,
        uuid: inventory.uuid,
        userUuid: myUuid
      }
    } as Event;

    // Append to the event log
    await this.ess.appendEventToInventoryLog(deleteInventoryEvent);

    // Update the inventories projection
    return this.updateInventoriesProjection(deleteInventoryEvent);
  }
}
