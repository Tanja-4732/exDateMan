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
  oof: boolean = false;
  unauthorized: boolean = false;
  notFound: boolean = false;
  loading: boolean = true;

  @Input()
  thing: Thing;

  stocks: Stock[];

  inventoryId: number;

  constructor(public ss: StockService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getInventoryId();
    this.setStocks().then();
  }

  getInventoryId(): void {
    this.inventoryId = this.route.snapshot.params["inventoryId"];
  }

  async setStocks(): Promise<void> {
    try {
      this.stocks = await this.ss.getStocks(
        this.inventoryId,
        this.thing.number
      );
      this.loading = false;
    } catch (error) {
      this.oof = true;
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 401:
            // Set flag for html change and timeout above
            this.unauthorized = true;
            break;
          case 404:
            this.notFound = true;
        }
      } else {
        console.log("Unknown error in add-stock while creating");
      }
    }
  }
}
