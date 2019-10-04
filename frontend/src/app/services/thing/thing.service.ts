import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Thing } from "../../models/thing/thing";
import { InventoryService } from "../inventory/inventory.service";
import {
  EventSourcingService,
  crudType,
  itemType
} from "../EventSourcing/event-sourcing.service";

@Injectable({
  providedIn: "root"
})
export class ThingService {
  /**
   * The current state of things of all inventories (a projection from the event logs)
   */
  private static inventoryTingsProjection: { [uuid: string]: Thing[] };

  /**
   * Public inventoryTingsProjection accessor
   */
  get things() {
    return ThingService.inventoryTingsProjection;
  }

  /**
   * Sneaky stuff
   *
   * Used to get around the "no async constructors" limitation
   */
  public ready: Promise<any>;

  constructor(private is: InventoryService, private ess: EventSourcingService) {
    // Ready declaration
    this.ready = new Promise((resolve, reject) => {
      if (ThingService.inventoryTingsProjection == null) {
        console.log("should fetch all");

        this.fetchAllInventoryThings().then(result => {
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
   * Iterates over all inventories and fetches their things
   */
  async fetchAllInventoryThings() {
    console.log("fetch all");

    // Initialize the array
    ThingService.inventoryTingsProjection = ([] as unknown) as {
      [uuid: string]: Thing[];
    };

    for (const inventory in this.is.inventories) {
      if (this.is.inventories.hasOwnProperty(inventory)) {
        console.log("no oof");

        const uuid = this.is.inventories[inventory].uuid;

        console.log("and the uuid is:");
        console.log(uuid);

        // Initialize the inner array
        ThingService.inventoryTingsProjection[uuid] = [];

        // Fetch and apply the Things of the Inventory
        await this.fetchInventoryThings(uuid);
      }
    }
  }

  /**
   * Fetches an inventories' things and applies them to a projection
   *
   * @param inventoryUuid The UUID of the inventory to be fetched
   */
  async fetchInventoryThings(inventoryUuid: string) {
    // Wait for the InventoryService & EventSourcingService to be ready
    await this.is.ready;
    await this.ess.ready;

    // Iterate over the events
    for (const event of this.ess.events[inventoryUuid]) {
      // Only apply Thing events
      if (event.data.itemType !== itemType.THING) {
        continue;
      }

      // Apply the event
      switch (event.data.crudType) {
        case crudType.CREATE:
          ThingService.inventoryTingsProjection[inventoryUuid].push({
            uuid: event.data.uuid,
            name: event.data.thingData.name,
            categoryUuids: event.data.thingData.categoryUuids,
            createdOn: event.data.thingData.createdOn
          });
          break;
        case crudType.UPDATE:
          // Only update from values not equaling null
          ThingService.inventoryTingsProjection[inventoryUuid][
            event.data.uuid
          ] = {
            name:
              event.data.thingData.name != null
                ? event.data.thingData.name
                : ThingService.inventoryTingsProjection[inventoryUuid][
                    event.data.uuid
                  ].name,
            categoryUuids:
              event.data.thingData.categoryUuids != null
                ? event.data.thingData.categoryUuids
                : ThingService.inventoryTingsProjection[inventoryUuid][
                    event.data.uuid
                  ].categoryUuids,
            createdOn:
              event.data.thingData.createdOn != null
                ? event.data.thingData.createdOn
                : ThingService.inventoryTingsProjection[inventoryUuid][
                    event.data.uuid
                  ].createdOn
          };
          break;
        case crudType.DELETE:
          delete ThingService.inventoryTingsProjection[inventoryUuid][
            event.data.uuid
          ];
          break;
      }
    }
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
      console.error(err);

      throw new Error(
        " The inventory with UUID " + inventoryUuid + " couldn't be found."
      );
    }
  }

  /**
   * Creates a thing by adding a thingCreatedEvent to the event log
   *
   * @param thing The thing to be created
   * @param inventoryUuid THhe UUID of the things inventory
   */
  async newThing(thing: Thing, inventoryUuid: string): Promise<Thing> {}

  // TODO
  async updateThing(thing: Thing, inventoryUuid: string): Promise<Thing> {}

  // TODO
  async removeThing(thing: Thing, inventoryUuid: string): Promise<void> {}
}
