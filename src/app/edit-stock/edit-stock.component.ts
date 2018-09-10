import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { THING } from "../models/thing.model";
import { STOCK } from "../models/stock.model";

@Component({
  selector: "app-edit-stock",
  templateUrl: "./edit-stock.component.html",
  styleUrls: ["./edit-stock.component.scss"]
})
export class EditStockComponent implements OnInit {
  stopOperation = false;

  thing: THING;
  stock: STOCK;

  thingName: string;
  stockId: number;

  exDate: Date;
  useUpIn: number; // Days
  quantity: string;
  percentLeft: number;

  constructor(private router: ActivatedRoute) {}

  ngOnInit() {
    this.getStock();
  }

  getStock() {
    this.thingName = this.router.snapshot.params["thingName"];
    this.stockId = this.router.snapshot.params["stockId"];

    this.thing = THING.getThingByName(this.thingName);
    console.log("Stock ID=" + this.stockId);

    this.stock = this.thing.getStockById(this.stockId);
    try {

      this.exDate = this.stock.exDate;
      this.useUpIn = this.stock.useUpIn;
      this.quantity = this.stock.quantity;
      this.percentLeft = this.stock._percentLeft;
    } catch (error) {
      this.stopOperation = true;
      // console.error(error);
      console.log("Error.");
    }
  }

  onEditStock() {
    this.stock.exDate = this.exDate;
    this.stock.useUpIn = this.useUpIn;
    this.stock.quantity = this.quantity;
    this.stock.percentLeft = this.percentLeft;
  }
}
