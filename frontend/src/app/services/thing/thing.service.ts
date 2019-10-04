import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Thing } from "../../models/thing/thing";
import { InventoryService } from "../inventory/inventory.service";

@Injectable({
  providedIn: "root"
})
export class ThingService {
  /**
   * The current state of things of all inventories (a projection from the event logs)
   */
  private static inventoryTingsProjection: { [uuid: string]: Thing[] };

  /**
   * Sneaky stuff
   *
   * Used to get around the "no async constructors" limitation
   */
  public ready: Promise<any>;

  constructor(private is: InventoryService) {
    // Ready declaration
    this.ready = new Promise((resolve, reject) => {
      if (ThingService.inventoryTingsProjection == null) {
        this.fetchInventoryThings().then(result => {
          // Mark as ready
          resolve(null);
        });
      } else {
        // Mark as ready
        resolve(null);
      }
    });
  }

  async fetchInventoryThings() {
    // Wait for the InventoryService to be ready
    await this.is.ready;
  }

  async getThing(inventoryUuid: string, thingUuid: string): Promise<Thing> {
    // Wait the ThingService itself is ready
    await this.ready;

    try {
      // Get and return the thing
      return ThingService.inventoryTingsProjection[inventoryUuid][thingUuid];
    } catch (err) {
      // When the thing couldn't be found
      throw new Error(
        "The thing with UUID " +
          thingUuid +
          " of inventory with UUID " +
          inventoryUuid +
          " couldn't be found."
      );
    }
  }

  /**
   * Get all things in an array of an inventory from the local projection
   *
   * @param inventoryUuid The UUID of the inventory of which to get the things of
   */
  async getThings(inventoryUuid: string): Promise<Thing[]> {
    // Wait the ThingService itself is ready
    await this.ready;

    try {
      // Get and return the thing array
      return ThingService.inventoryTingsProjection[inventoryUuid];
    } catch (err) {
      // When the inventory couldn't be found
      throw new Error(
        " The inventory with UUID " + inventoryUuid + " couldn't be found."
      );
    }
  }

  async newThing(thing: Thing, inventoryUuid: string): Promise<Thing> {}

  // TODO
  async updateThing(thing: Thing, inventoryUuid: string): Promise<Thing> {}

  // TODO
  async removeThing(thing: Thing, inventoryUuid: string): Promise<void> {}
}
