import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Stock } from "../../models/stock/stock";
import { StockService } from "../../services/stock/stock.service";
import { HttpErrorResponse } from "@angular/common/http";

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

  constructor(private ss: StockService, private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    // Get the inventory UUID
    this.inventoryUuid = this.route.snapshot.params.inventoryId;

    // Get the Thing UUID
    this.thingUuid = this.route.snapshot.params.thingNumber;

    // Fetch the Stocks
    await this.getStocks();
  }

  async getStocks(): Promise<void> {
    try {
      this.stocks = await this.ss.getStocks(this.inventoryUuid, this.thingUuid);
      this.loading = false;
    } catch (error) {
      this.oof = true;
      console.log(
        "Unknown error in getStocks [StocksComponent] while creating"
      );
    }
  }

  onAddStock(): void {}
}
