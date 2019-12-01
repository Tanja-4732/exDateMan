import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { AsyncConstructor } from "../../interfaces/async-constructor";

/**
 * This Service stores & sorts Events and syncs them with the API.
 *
 * This class needs to await async operations before it can be used, but
 * TypeScript does not support await to be used in constructors, so the user
 * has to await the ready promise of this class.
 */
@Injectable({
  providedIn: "root"
})
export class EventSourcingService implements AsyncConstructor {
  constructor(private api: HttpClient) {
    this.prepare();
  }

  /**
   * The events of all inventories cached in memory
   */
  public static events: LocalEventStorage[];

  /**
   * Sneaky stuff
   *
   * Used to get around the "no async constructors" limitation
   */
  public ready: Promise<any>;

  /**
   * The API base url
   */
  private baseUrl: string = environment.baseUrl;

  /**
   * Loads the events from localStorage into memory
   */
  loadEvents(): void {
    // Get the events from LocalStorage
    const events = JSON.parse(window.localStorage.getItem("events"));

    // Prevent undefined array
    if (events == null) {
      EventSourcingService.events = [];
    } else {
      EventSourcingService.events = events;
    }
  }

  /**
   * Stores the events in localStorage
   */
  saveEvents(): void {
    console.log(
      "The events are being saved.\n" +
        JSON.stringify(EventSourcingService.events)
    );

    // Set the localStorage to the new value
    window.localStorage.setItem(
      "events",
      JSON.stringify(EventSourcingService.events)
    );
  }

  /**
   * Prepares this class for operaton and resolves the ready promise when done
   */
  private prepare() {
    // Ready declaration
    this.ready = new Promise(resolve => {
      if (
        EventSourcingService.events == null ||
        EventSourcingService.events.length === 0
      ) {
        this.reFetchAll().then(() => {
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
   * Refreshes all Events
   */
  public async reFetchAll(): Promise<void> {
    // Reset all current event logs
    EventSourcingService.events = [];

    try {
      // Try to fetch all events from the API
      await this.fetchAllInventoryEvents();

      // Persist the data offline & refresh everything
      this.saveEvents();
    } catch (err) {
      //  Use the offline data instead of the API
      this.loadEvents();
    }
  }

  /**
   * Fetches a list of all accessible inventory uuids via the API
   *
   * Then it iterates over said list and fetches the events of each
   *
   * This method gets called in the EventSourcingService constructor
   */
  private async fetchAllInventoryEvents() {
    // Get a list of all accessible inventory uuids from the API
    const accessibleUuids = await this.api
      .get<string[]>(this.baseUrl + "/authorization/accessibleInventoryUuids")
      .toPromise();

    // Iterate over the list
    for (const inventoryUuid of accessibleUuids) {
      // Fetch the events from the inventory
      await this.fetchSingleInventoryEvents(inventoryUuid);
    }
  }

  /**
   * Fetches an inventories event-log and parses it
   *
   * @param inventoryUuid The uuid of the inventory to be fetched
   */
  private async fetchSingleInventoryEvents(
    inventoryUuid: string
  ): Promise<void> {
    const res: Event[] = await this.api
      .get<Event[]>(this.baseUrl + "/events/" + inventoryUuid)
      .toPromise();

    // Get the event log of the inventory
    let inventoryEvents = EventSourcingService.events.find(
      el => el.uuid === inventoryUuid
    );

    // Check, if the event log doesn't exist yet
    if (inventoryEvents == null) {
      // If so, create it
      const newValue = {
        uuid: inventoryUuid,
        events: []
      };
      EventSourcingService.events.push(newValue);
      inventoryEvents = newValue;
    }

    // Load the events of the current eventLog from LocalStorage
    const localEvents = JSON.parse(window.localStorage.getItem("events")).find(
      (eventLog: { uuid: string; events: Event[] }) =>
        eventLog.uuid === inventoryUuid
    ).events;

    // Reload flag
    let needsReload = false;

    // Merge the event streams from the API with the local one
    for (const le of localEvents) {
      // Check for events missing in the API response
      if (!res.some(event => event.date === le.date)) {
        // Upload the missing event to the API
        await this.api.put<Event[]>(this.baseUrl + "/events/", le).toPromise();

        // Set the needsReload flag
        needsReload = true;
      }
    }

    if (needsReload) {
      // Reload the events list the API to make sure they are sorted
      res = await this.api
        .get<Event[]>(this.baseUrl + "/events/" + inventoryUuid)
        .toPromise();
    }

    // Write the received events in the event log of the inventory
    inventoryEvents.events = res;
  }

  /**
   * Appends an event to its corresponding event log and sends it to the API
   *
   * @param event The event to be appended to its log
   */
  public async appendEventToInventoryLog(event: Event): Promise<void> {
    try {
      // After a successful transmission, the event gets appended to the local event log
      // EventSourcingService.eventLogs[event.inventoryUuid].push(event);
      let inventoryEvents = EventSourcingService.events.find(
        el => el.uuid === event.inventoryUuid
      );

      if (inventoryEvents == null) {
        const newLog = { events: [], uuid: event.inventoryUuid };
        EventSourcingService.events.push(newLog);
        inventoryEvents = newLog;
      }

      inventoryEvents.events.push(event);

      // Persist the data offline & refresh everything
      this.saveEvents();

      // Transmit the event to the server to be stored in the db
      const res: Event[] = await this.api
        .put<Event[]>(this.baseUrl + "/events/", event)
        .toPromise();
    } catch (err) {
      console.log("Couldn't push event");

      console.error(err);
    }
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
  // inventories: {

  /**
   * The uuid of the inventory this event stream is dedicated to
   */
  uuid: string;

  /**
   * The event log of the inventory
   */
  events: Event[];

  // }[];
}

/**
 * The data structure of an event
 */
export interface Event {
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
      WritablesUuids?: string[];

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
      name?: string;

      /**
       * The date of the creation of this category
       *
       * This field may only be set in an category-created event
       */
      createdOn?: Date;

      /**
       * The UUIDs of the categories this thing has
       */
      categoryUuids?: string[];
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

      /**
       * The UUID of the Thing this stock belongs to
       */
      thingUuid: string;

      /**
       * The percentage of how much of the Stock is left
       */
      percentLeft: number;
    };
  };
}

/**
 * Used to describe on which type of item an operation was performed on
 */
export enum itemType {
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
export enum crudType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete"
}
