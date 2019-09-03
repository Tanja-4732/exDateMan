import { Injectable } from "@angular/core";
import { v4 } from "uuid";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class EventSourcingService {
  constructor(private api: HttpClient) {
    console.log("Hello there");
    console.log(v4());
  }

  /**
   * The event-logs (every inventory has its own)
   */
  private static eventLogs: { [uuid: string]: Event[] } = {};

  /**
   * The API base url
   */
  baseUrl: string = environment.baseUrl;

  /**
   * Fetches an inventories event-log and parses it.
   *
   * @param inventoryUuid The uuid of the inventory to be fetched
   */
  private async fetchInventoryEvents(inventoryUuid: string): Promise<void> {
    const res: Event[] = await this.api
      .get<Event[]>(this.baseUrl + "/events/" + inventoryUuid)
      .toPromise();

    EventSourcingService.eventLogs[inventoryUuid] = res;
  }

  public async appendEventToInventoryStream(event: Event): Promise<void> {
    try {
      const res: Event[] = await this.api
        .put<Event[]>(this.baseUrl + "/events/", event)
        .toPromise();

      EventSourcingService.eventLogs[event.inventoryUuid].push(event);
    } catch (err) {}
  }

  getAllLocalEventStreams(): LocalEventStorage {
    let les: LocalEventStorage;

    les.inventories;
    // TODO

    return les;
  }
}

/**
 * The data format of the persistent localStorage data
 */
interface LocalEventStorage {
  /**
   * An array of event streams
   *
   * Every inventory has its own event stream to keep unauthorized users form
   * accessing data for which they do not have permissions for.
   *
   * This works since the user-access-separation is made on the inventory level
   */
  inventories: {
    /**
     * The uuid of the inventory this event stream is dedicated to
     */
    uuid: string;

    /**
     * The event log of the inventory
     */
    events: Event[];
  }[];
}

/**
 * The data structure of an event
 */
interface Event {
  /**,
   * The date of the event
   */
  date: Date;

  /**
   * The uuid of the inventory-event-stream this event belongs to
   */
  inventoryUuid: string;

  /**
   * The data of the event
   */
  data: {
    /**
     * The uuid of the item this event is about
     * This information is redundant (but still required) on inventory events
     */
    uuid: string;

    /**
     * The uuid of the user who issued this event
     */
    userUuid: string;

    /**
     * Defines what type of item is this event about
     */
    itemType: itemType;

    /**
     * Defines what type of operation was performed
     */
    crudType: crudType;

    /**
     * The inventory-specific data (if this event is about an inventory)
     */
    inventoryData?: {
      /**
       * The name of this inventory
       */
      name?: string;

      /**
       * The uuid of the owner of this inventory
       */
      ownerUuid?: string;

      /**
       * An array of users who have the admin privilege for this inventory
       */
      adminsUuids?: string[];

      /**
       * An array of user uuids who have the write privilege for this inventory
       */
      writeablesUuids?: string[];

      /**
       * An array of user uuids who have the read privilege for this inventory
       */
      readablesUuids?: string[];

      /**
       * The date of the creation of this inventory
       *
       * This field may only be set in an inventory-created event
       */
      createdOn?: Date;
    };
    /**
     * The category-specific data (if this event is about a category)
     */
    categoryData?: {
      /**
       * The name of the category
       */
      name?: string;

      /**
       * The parent-category of this category
       *
       * Top-level categories are their own parent
       */
      parentUuid?: string;

      /**
       * The date of the creation of this category
       *
       * This field may only be set in an category-created event
       */
      createdOn?: Date;
    };

    /**
     * The thing-specific data (if this event is about a thing)
     */
    thingData?: {
      /**
       * The name of the thing
       */
      name: string;

      /**
       * The date of the creation of this category
       *
       * This field may only be set in an category-created event
       */
      createdOn?: Date;
    };

    /**
     * The stock-specific data (if this event is about a stock)
     */
    stockData?: {
      /**
       * The expiration date of the stock
       */
      exDate?: Date;

      /**
       * How many days after the opening of this stock is it still usable?
       */
      useUpIn?: number;

      /**
       * Text description of the quantity of the stock
       */
      quantity?: string;

      /**
       * When was this stock opened?
       */
      openedOn: Date;

      /**
       * The date of the creation of this category
       *
       * This field may only be set in an category-created event
       */
      createdOn?: Date;
    };
  };
}

/**
 * Used to describe on which type of item an operation was performed on
 */
enum itemType {
  INVENTORY = "inventory",
  CATEGORY = "category",
  THING = "thing",
  STOCK = "stock"
}

/**
 * Used to describe which type of operation was performed
 *
 * (read is excluded from this list since it doesn't affect the data)
 */
enum crudType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete"
}
