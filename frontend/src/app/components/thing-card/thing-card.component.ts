import { Component, OnInit, Input } from "@angular/core";
import { Thing } from "../../models/thing/thing";
import { StockService } from "../../services/stock/stock.service";
import { Stock } from "../../models/stock/stock";
import { ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-thing-card",
  templateUrl: "./thing-card.component.html",
  styleUrls: ["./thing-card.component.scss"]
})
export class ThingCardComponent implements OnInit {
  oof = false;
  unauthorized = false;
  notFound = false;
  loading = true;

  @Input()
  thing: Thing;

  stocks: Stock[];

  inventoryUuid: string;

  constructor(public ss: StockService, private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    this.inventoryUuid = this.route.snapshot.params.inventoryUuid;

    await this.fetchStocks();
  }

  async fetchStocks(): Promise<void> {
    try {
      // Wait for the stockService to be ready
      await this.ss.ready;

      // Fetch the stocks from the stockService
      this.stocks = this.ss.stocks[this.inventoryUuid][this.thing.uuid];
      this.loading = false;
    } catch (error) {
      this.oof = true;

      console.log(
        "Unknown error in fetchStocks [ThingCardComponent] while creating"
      );
    }
  }
}
