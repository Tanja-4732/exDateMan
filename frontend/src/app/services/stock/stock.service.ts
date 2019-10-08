import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Stock } from "../../models/stock/stock";
import { ThingService } from "../thing/thing.service";
import { InventoryService } from "../inventory/inventory.service";
import { EventSourcingService } from "../EventSourcing/event-sourcing.service";
import { AuthService } from "../auth/auth.service";
import { Thing } from "../../models/thing/thing";

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
  async fetchAllInventoryThingStocks() {
    console.log("fetch all Stocks");

    // Wait for the InventoryService & EventSourcingService to be ready
    await this.ts.ready;
    await this.is.ready;
    await this.ess.ready;

    // Initialize the array
    StockService.inventoryTingsStocksProjection = {};

    // Iterate over all Inventories
    for (const inventory in this.is.inventories) {
      if (this.is.inventories.hasOwnProperty(inventory)) {
        /**
         * The UUID of the Inventory of the current iteration
         */
        const inventoryUuid = this.is.inventories[inventory].uuid;

        console.log("and the inventory uuid is:");
        console.log(inventoryUuid);

        // Iterate over all Things of the Inventory being iterated over
        for (const thing in this.ts.things[inventoryUuid]) {
          if (this.ts.things[inventoryUuid].hasOwnProperty(thing)) {
            // Initialize the inner array
            StockService.inventoryTingsStocksProjection[inventoryUuid][
              thing
            ] = [];

            // Fetch and apply the Stocks of the Things of the Inventory
            await this.applyStockEvent(inventoryUuid);
          }
        }
      }
    }
  }

  async applyStockEvent(inventoryUuid: string, thingUuid: string) {
    StockService.inventoryTingsStocksProjection[inventoryUuid][thingUuid];

    await this.is.ready;
    this.ess.events;
  }

  async getStock(
    inventoryId: number,
    thingNumber: number,
    stockNumber: number
  ): Promise<Stock> {
    const qRes: Stock = await this.http
      .get<Stock>(
        this.baseUrl +
          "/inv/" +
          inventoryId +
          "/things/" +
          thingNumber +
          "/stocks/" +
          stockNumber
      )
      .toPromise();
    if (qRes != null) {
      qRes.openedOn = new Date(qRes.openedOn);
      qRes.exDate = new Date(qRes.exDate);
      qRes.addedOn = new Date(qRes.addedOn);
    }
    return qRes;
  }

  async getStocks(inventoryUuid: string, thingUuid: string): Promise<Stock[]> {
    if (inventoryUuid == null || thingUuid == null) {
      throw new Error("Arguments invalid");
    }

    return qRes;
  }

  async newStock(
    stock: Stock,
    inventoryId: number,
    thingNumber: number
  ): Promise<Stock> {
    return await this.http
      .post<Stock>(
        this.baseUrl +
          "/inv/" +
          inventoryId +
          "/things/" +
          thingNumber +
          "/stocks",
        stock
      )
      .toPromise();
  }

  async updateStock(
    stock: Stock,
    inventoryId: number,
    thingNumber: number
  ): Promise<Stock> {
    return await this.http
      .put<Stock>(
        this.baseUrl +
          "/inv/" +
          inventoryId +
          "/things/" +
          thingNumber +
          "/stocks/" +
          stock.number,
        stock
      )
      .toPromise();
  }

  async deleteStock(
    stock: Stock,
    inventoryId: number,
    thingNumber: number
  ): Promise<unknown> {
    const qRes: unknown = this.http
      .delete<Stock>(
        this.baseUrl +
          "/inv/" +
          inventoryId +
          "/things/" +
          thingNumber +
          "/stocks/" +
          stock.number
      )
      .toPromise();
    return qRes;
  }

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
