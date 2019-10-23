import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Stock } from "../../models/stock/stock";
import { StockService } from "../../services/stock/stock.service";
import { HttpErrorResponse } from "@angular/common/http";
import {
  CrumbTrailComponent,
  Icon
} from "../crumb-trail/crumb-trail.component";
import { InventoryService } from "../../services/inventory/inventory.service";
import { ThingService } from "../../services/thing/thing.service";

@Component({
  selector: "app-stocks",
  templateUrl: "./stocks.component.html",
  styleUrls: ["./stocks.component.scss"]
})
export class StocksComponent implements OnInit {
  // Flags
  oof = false;
  unauthorized = false;
  notFound = false;
  loading = true;

  // UUIDs
  inventoryUuid: string;
  thingUuid: string;

  /**
   * An array of all Stocks to be listed in this component
   */
  stocks: Stock[] = [];

  constructor(
    private ss: StockService,
    private route: ActivatedRoute,
    private is: InventoryService,
    private ts: ThingService
  ) {}

  async ngOnInit(): Promise<void> {
    // Get the inventory UUID
    this.inventoryUuid = this.route.snapshot.params.inventoryUuid;

    // Get the Thing UUID
    this.thingUuid = this.route.snapshot.params.thingUuid;

    await this.is.ready;
    await this.ts.ready;

    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Inventory,
        title: this.is.inventories[this.inventoryUuid].name,
        routerLink: `/inventories`
      },
      {
        icon: Icon.Thing,
        title: this.ts.things[this.inventoryUuid].find(
          thing => thing.uuid === this.thingUuid
        ).name,
        routerLink: `/inventories/${this.inventoryUuid}/things`
      },
      {
        icon: Icon.Stock,
        title: "Stocks"
      }
    ];

    // Fetch the Stocks
    await this.getStocks();
  }

  async getStocks(): Promise<void> {
    try {
      // Wait for the StockService to be ready
      await this.ss.ready;

      // Get the Stocks
      console.log("Stocks array:");
      console.log(this.ss.stocks);

      this.stocks = this.ss.stocks[this.inventoryUuid][this.thingUuid];
      this.loading = false;
    } catch (error) {
      this.oof = true;
      console.error(error);
      console.log(
        "Unknown error in getStocks [StocksComponent] while creating"
      );
    }
  }

  onAddStock(): void {}
}
