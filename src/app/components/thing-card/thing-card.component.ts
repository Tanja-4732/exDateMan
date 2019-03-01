import { Component, OnInit, Input } from "@angular/core";
import { Thing } from "../../models/thing/thing";
import { StockService } from "../../services/stock/stock.service";
import { Stock } from "../../models/stock/stock";

@Component({
  selector: "app-thing-card",
  templateUrl: "./thing-card.component.html",
  styleUrls: ["./thing-card.component.scss"]
})
export class ThingCardComponent implements OnInit {
  @Input()
  thing: Thing;

  stocks: Stock[];

  constructor(private ss: StockService) {}

  ngOnInit(): void {
    this.ss.getStocks()
  }
}
