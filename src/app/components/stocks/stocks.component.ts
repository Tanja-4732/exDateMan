import { THING } from "../../models/thing.model";
import { STOCK } from "../../models/stock.model";
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
  oof: boolean = false;
  unauthorized: boolean = false;
  loading: boolean = true;

  inventoryId: number;
  thingNumber: number;

  stocks: Stock[] = [];

  constructor(
    private ss: StockService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getInventoryIdAndThingNumber();
    this.getStocks().then();
    setTimeout(() => {
      if (this.unauthorized) {
        this.router.navigate(["/login"]);
      }
    }, 3000);
  }

  async getStocks(): Promise<void> {
    try {
      this.stocks = await this.ss.getStocks(this.inventoryId, this.thingNumber);
      this.loading = false;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          // Set flag for html change and timeout above
          this.unauthorized = true;
        } else {
          console.log("Unknown error in stocks while fetching");
        }
      }
    }
  }

  getInventoryIdAndThingNumber(): void {
    this.inventoryId = this.route.snapshot.params["inventoryId"];
    this.thingNumber = this.route.snapshot.params["thingNumber"];
  }

  onAddStock(): void {}
}
