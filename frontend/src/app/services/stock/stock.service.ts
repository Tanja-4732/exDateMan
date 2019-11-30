import { Injectable } from "@angular/core";
import { Stock } from "../../models/stock/stock";
import { ThingService } from "../thing/thing.service";
import { InventoryService } from "../inventory/inventory.service";
import {
  EventSourcingService,
  itemType,
  Event,
  crudType
} from "../EventSourcing/event-sourcing.service";
import { AuthService } from "../auth/auth.service";
import { Thing } from "../../models/thing/thing";
import { StocksComponent } from "../../components/stocks/stocks.component";

@Injectable({
  providedIn: "root"
})
export class StockService {
  /**
   * The current state of Stocks of all Things of all Inventories
   *
   * (a projection from the event logs)
   */
  private static inventoryTingsStocksProjection: {
    [inventoryUuid: string]: { [thingUuid: string]: Stock[] };
  };

  /**
   * The Stocks projection
   *
   * Usage:
   * `[inventoryUuid][thingUuid]`
   */
  get stocks() {
    return StockService.inventoryTingsStocksProjection;
  }
  /**
   * Sneaky stuff
   *
   * Used to get around the "no async constructors" limitation
   */
  public ready: Promise<any>;

  constructor(
    private ts: ThingService,
    private is: InventoryService,
    private ess: EventSourcingService,
    private as: AuthService
  ) {
    // Ready declaration
    this.ready = new Promise((resolve, reject) => {
      if (StockService.inventoryTingsStocksProjection == null) {
        this.fetchAllInventoryThingStocks().then(result => {
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
  private async fetchAllInventoryThingStocks() {
    console.log("fetch all Stocks");

    // Wait for the InventoryService & EventSourcingService to be ready
    await this.ts.ready;
    await this.is.ready;
    await this.ess.ready;

    // Initialize the dict
    StockService.inventoryTingsStocksProjection = {};

    // Iterate over the Inventories projection
    for (const inventoryUuid in this.is.inventories) {
      if (this.is.inventories.hasOwnProperty(inventoryUuid)) {
        // Initialize the dict for the Inventory
        StockService.inventoryTingsStocksProjection[inventoryUuid] = {};

        // Iterate over the Things of the Inventory using the projections
        for (const thing of this.ts.things[inventoryUuid]) {
          // Initialize the Stocks array
          StockService.inventoryTingsStocksProjection[inventoryUuid][
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

  private async applyStockEvent(stockEvent: Event) {
    await this.is.ready;

    /**
     * One date representing now
     */
    const addedOn = new Date();

    const newStock = {
      addedOn,
      exDate: stockEvent.data.stockData.exDate,
      openedOn: stockEvent.data.stockData.openedOn,
      percentLeft: stockEvent.data.stockData.percentLeft,
      quantity: stockEvent.data.stockData.quantity,
      useUpIn: stockEvent.data.stockData.useUpIn,
      uuid: stockEvent.data.uuid
    };

    console.log("This is the stocksProjection");
    console.log(StockService.inventoryTingsStocksProjection);

    /**
     * The index of the event in the projection, if any
     */
    const index = StockService.inventoryTingsStocksProjection[
      stockEvent.inventoryUuid
    ][stockEvent.data.stockData.thingUuid].findIndex(
      stock => stock.uuid === stockEvent.data.uuid
    );

    switch (stockEvent.data.crudType) {
      case crudType.DELETE:
        // Delete a Stock from the projection
        StockService.inventoryTingsStocksProjection[stockEvent.inventoryUuid][
          stockEvent.data.stockData.thingUuid
        ].splice(index, 1);
        break;

      case crudType.CREATE:
        // Push a new Stock onto the Projection
        StockService.inventoryTingsStocksProjection[stockEvent.inventoryUuid][
          stockEvent.data.stockData.thingUuid
        ].push(newStock);
        break;
      case crudType.UPDATE:
        // Update a Stock already included in the projection

        // Remove immutable values
        delete newStock.uuid;
        delete newStock.addedOn;

        // Delete all null values
        Object.keys(newStock).forEach(
          key => newStock[key] == null && delete newStock[key]
        );

        // Assign the changed values
        Object.assign(
          StockService.inventoryTingsStocksProjection[stockEvent.inventoryUuid][
            stockEvent.data.stockData.thingUuid
          ][index],
          newStock
        );
        break;
    }
  }

  /**
   * Creates a Stock
   *
   * @param stock The stock to be created
   * @param inventoryUuid The UUID of the Inventory
   * @param thingUuid THe UUID of the Thing
   */
  async newStock(
    stock: Stock,
    inventoryUuid: string,
    thingUuid: string
  ): Promise<void> {
    const now = new Date();
    const event = {
      date: now,
      inventoryUuid,
      data: {
        uuid: stock.uuid,
        crudType: crudType.CREATE,
        itemType: itemType.STOCK,
        userUuid: (await this.as.getCurrentUser()).user.uuid,
        stockData: {
          createdOn: now,
          exDate: stock.exDate,
          useUpIn: stock.useUpIn,
          openedOn: stock.openedOn,
          quantity: stock.quantity,
          percentLeft: stock.percentLeft,
          thingUuid
        }
      }
    };

    await this.ess.appendEventToInventoryLog(event);
    await this.applyStockEvent(event);
  }

  /**
   * Updates a Stock
   *
   * @param stock The stock to be updated
   * @param inventoryUuid The UUID of the Inventory
   * @param thingUuid THe UUID of the Thing
   */
  async updateStock(
    stock: Stock,
    inventoryUuid: string,
    thingUuid: string
  ): Promise<void> {
    const now = new Date();
    const event = {
      inventoryUuid,
      date: now,
      data: {
        crudType: crudType.UPDATE,
        itemType: itemType.STOCK,
        userUuid: (await this.as.getCurrentUser()).user.uuid,
        stockData: {},
        uuid: stock.uuid
      }
    } as Event;

    if (stock.exDate != null) {
      event.data.stockData.exDate = stock.exDate;
    }

    if (stock.openedOn != null) {
      event.data.stockData.openedOn = stock.openedOn;
    }

    if (stock.percentLeft != null) {
      event.data.stockData.percentLeft = stock.percentLeft;
    }

    if (stock.quantity != null) {
      event.data.stockData.quantity = stock.quantity;
    }

    if (stock.useUpIn != null) {
      event.data.stockData.useUpIn = stock.useUpIn;
    }

    await this.ess.appendEventToInventoryLog(event);
    await this.applyStockEvent(event);
  }

  /**
   * Deletes a Stock
   *
   * @param stock The stock to be deleted
   * @param inventoryUuid The UUID of the Inventory
   * @param thingUuid THe UUID of the Thing
   */
  async deleteStock(
    stock: Stock,
    inventoryUuid: string,
    thingUuid: string
  ): Promise<void> {
    const now = new Date();
    const event = {
      inventoryUuid,
      date: now,
      data: {
        crudType: crudType.DELETE,
        itemType: itemType.STOCK,
        userUuid: (await this.as.getCurrentUser()).user.uuid
      }
    } as Event;

    await this.ess.appendEventToInventoryLog(event);
    await this.applyStockEvent(event);
  }

  /**
   * Calculates the effective date of expiration for a given Stock
   *
   * @param stock The Stock to calculate the exDate of
   */
  calculateExDate(stock: Stock): Date {
    console.log(stock);

    if (stock.useUpIn != null && stock.openedOn) {
      return (new Date().setDate(
        stock.openedOn.getDate() + stock.useUpIn
      ) as unknown) as Date;
    } else {
      return stock.exDate;
    }
  }
}
