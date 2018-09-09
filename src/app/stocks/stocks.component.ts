import { THING } from "./../models/thing.model";
import { STOCK } from "./../models/stock.model";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-stocks",
  templateUrl: "./stocks.component.html",
  styleUrls: ["./stocks.component.scss"]
})
export class StocksComponent implements OnInit {
  constructor(private router: ActivatedRoute) {}
  stopOperation = false;
  stocks: STOCK[];
  thingName: string;
  ngOnInit() {
    this.getStocks();
  }

  getStocks() {
    this.thingName = this.router.snapshot.params["thingName"];
    try {
      this.stocks = THING.getStocksByName(this.thingName);
    } catch (error) {
      this.stopOperation = true;
      // console.error(error);
      console.log("Error.");
    }
  }

  onAddStock() {}
}
