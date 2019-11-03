import { Input } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { Stock } from "../../models/stock/stock";
import { StockService } from "../../services/stock/stock.service";

@Component({
  selector: "app-stock-card",
  templateUrl: "./stock-card.component.html",
  styleUrls: ["./stock-card.component.scss"]
})
export class StockCardComponent implements OnInit {
  @Input()
  stock: Stock;

  calculatedExDate: Date;

  constructor(private ss: StockService) {}

  ngOnInit(): void {
    this.calculatedExDate = this.ss.calculateExDate(this.stock);
    console.log(this.stock);
  }
}
