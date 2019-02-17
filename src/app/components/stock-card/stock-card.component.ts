import { THING } from "../../models/thing.model";
import { STOCK } from "../../models/stock.model";
import { Input } from "@angular/core";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-stock-card",
  templateUrl: "./stock-card.component.html",
  styleUrls: ["./stock-card.component.scss"]
})
export class StockCardComponent implements OnInit {
  constructor() {}
  thing: THING;
  @Input()
  stock: STOCK;

  ngOnInit() {
    this.thing = this.stock.thing;
  }
}
