import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Thing } from "../../models/thing/thing";
import { InventoryService } from "../inventory/inventory.service";
import {
  EventSourcingService,
  crudType,
  itemType,
  Event
} from "../EventSourcing/event-sourcing.service";
import { AuthService } from "../auth/auth.service";

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

  constructor(
    private is: InventoryService,
    private ess: EventSourcingService,
    private as: AuthService
  ) {
    // Ready declaration
    this.ready = new Promise((resolve, reject) => {
      if (ThingService.inventoryTingsProjection == null) {
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

    // Wait for the InventoryService & EventSourcingService to be ready
    await this.is.ready;
    await this.ess.ready;

    // Initialize the array
    ThingService.inventoryTingsProjection = ([] as unknown) as {
      [uuid: string]: Thing[];
    };

    for (const inventory in this.is.inventories) {
      if (this.is.inventories.hasOwnProperty(inventory)) {
        console.log("no oof");

        const uuid = this.is.inventories[inventory].uuid;

        console.log("and the inventory uuid is:");
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
    // Iterate over the events
    for (const event of this.ess.events[inventoryUuid]) {
      // Only apply Thing events
      if (event.data.itemType !== itemType.THING) {
        continue;
      }

      // Apply the event
      this.applyThingEvent(event, inventoryUuid);
    }
  }

  /**
   * Applies an Event to the Things projection
   *
   * @param event The Event to be applied
   * @param inventoryUuid The UUID of the Inventory
   */
  private applyThingEvent(event: Event, inventoryUuid: string) {
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
          createdOn: event.data.thingData.createdOn =
            ThingService.inventoryTingsProjection[inventoryUuid][
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

  /**
   * Creates a thing by adding a thingCreatedEvent to the event log
   *
   * @param thing The thing to be created
   * @param inventoryUuid THhe UUID of the things inventory
   */
  async newThing(thing: Thing, inventoryUuid: string): Promise<void> {
    // Wait for ThingService to be ready
    await this.ready;

    /**
     * The current date
     *
     * This is stored in a constant, in order to have the exact same date for
     * both the createdOn of the Thing and the date of the Event itself.
     */
    const now = new Date();

    /**
     * The new-inventory event
     */
    const newInventoryEvent: Event = {
      inventoryUuid,
      date: now,
      data: {
        userUuid: (await this.as.getCurrentUser()).user.uuid,
        crudType: crudType.CREATE,
        itemType: itemType.THING,
        uuid: thing.uuid,
        thingData: {
          name: thing.name,
          createdOn: now,
          categoryUuids: thing.categoryUuids
        }
      }
    };

    // Push the event to the API and append it to the log
    await this.ess.appendEventToInventoryLog(newInventoryEvent);
    this.applyThingEvent(newInventoryEvent, inventoryUuid);
  }

  /**
   * Updates a Thing by issuing a new Event, sending it to the DB via the API,
   * adding it to the local Event log and applying it immediately to the
   * projection.
   *
   * @param thing The thing to be updated with the new values
   * @param inventoryUuid The UUID of the Things Inventory
   */
  async updateThing(thing: Thing, inventoryUuid: string): Promise<void> {
    const event: Event = {
      date: new Date(),
      inventoryUuid,
      data: {
        itemType: itemType.THING,
        crudType: crudType.UPDATE,
        userUuid: (await this.as.getCurrentUser()).user.uuid,
        uuid: thing.uuid,
        thingData: {
          name: thing.name,
          categoryUuids: thing.categoryUuids
        }
      }
    };

    await this.ess.appendEventToInventoryLog(event);
    this.applyThingEvent(event, inventoryUuid);
  }

  /**
   * Removes a Thing by issuing a new Event, sending it to the DB via the API,
   * adding it to the local Event log and applying it immediately to the
   * projection.
   *
   * @param thing The thing to be removed
   * @param inventoryUuid The UUID of the Things Inventory
   */
  async removeThing(thing: Thing, inventoryUuid: string): Promise<void> {
    const event: Event = {
      date: new Date(),
      inventoryUuid,
      data: {
        itemType: itemType.THING,
        crudType: crudType.DELETE,
        userUuid: (await this.as.getCurrentUser()).user.uuid,
        uuid: thing.uuid
      }
    };

    await this.ess.appendEventToInventoryLog(event);
    this.applyThingEvent(event, inventoryUuid);
  }
}
