import { THING } from "./../models/thing.model";
import { STOCK } from "./../models/stock.model";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-add-stock",
  templateUrl: "./add-stock.component.html",
  styleUrls: ["./add-stock.component.scss"]
})
export class AddStockComponent implements OnInit {
  exDate: Date;
  name: string;
  useUpIn: number; // Days
  quantity: string;

  private thing: THING;

  onAddStock() {
    this.thing.stocks.push(
      new STOCK(this.thing, this.exDate, this.quantity, this.useUpIn)
    );
  }

  // constructor(private thing: THING) {}

  ngOnInit() {}
}
