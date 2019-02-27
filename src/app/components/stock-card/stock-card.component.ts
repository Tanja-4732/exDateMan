import { Input } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { Stock } from "../../models/stock/stock";

@Component({
  selector: "app-stock-card",
  templateUrl: "./stock-card.component.html",
  styleUrls: ["./stock-card.component.scss"]
})
export class StockCardComponent implements OnInit {
  @Input()
  stock: Stock;

  ced: Date;

  constructor() {}

  ngOnInit(): void {
    console.log("Stock be like:");
    console.log(this.stock);
    this.ced = this.calculatedExDate;
    console.log(this.ced);
  }

  get calculatedExDate(): Date {
    // return new Date();
    if (this.stock.useUpIn != null && this.stock.openedOn) {
      return (new Date().setDate(
        this.stock.openedOn.getDate() + this.stock.useUpIn
      ) as unknown) as Date;
    } else {
      return this.stock.exDate;
    }
  }
}
