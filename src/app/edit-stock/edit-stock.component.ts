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
  exDate: Date;
  useUpIn: number; // Days
  quantity: string;
  stockId: number;
  thing: THING;
  stock: STOCK;
  thingName: any;

  constructor(private router: ActivatedRoute) {}

  ngOnInit() {}

  getStock() {
    this.thingName = this.router.snapshot.params["thingName"];
    this.stockId = this.router.snapshot.params["stockId"];
    console.log(this.stockId);
    try {
      this.thing = THING.getThingByName(this.thingName);
      this.stock = this.thing.getStockById(this.stockId);
    } catch (error) {
      this.stopOperation = true;
      // console.error(error);
      console.log("Error.");
    }
  }

  onEditStock() {

  }
}
