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

  ced: Date ;

  constructor() {}

  ngOnInit(): void {
    console.log("Stock be like:");
    console.log(this.stock);
    this.ced = this.stock.calculatedExDate;
    this.ced = new Date();
    console.log(this.ced);

  }


}
