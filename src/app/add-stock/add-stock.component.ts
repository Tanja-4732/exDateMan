import { THING } from "./../models/thing.model";
import { STOCK } from "./../models/stock.model";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-add-stock",
  templateUrl: "./add-stock.component.html",
  styleUrls: ["./add-stock.component.scss"]
})
export class AddStockComponent implements OnInit {
  constructor(private router: ActivatedRoute) {}
  stopOperation = false;
  exDate: Date;
  useUpIn: number; // Days
  quantity: string;
  thingName: string;

  private thing: THING;

  onAddStock() {
    this.thing.addStock(
      new STOCK(this.thing, this.exDate, this.quantity, this.useUpIn)
    );
  }
  ngOnInit() {
    this.getThing();
  }

  getThing() {
    this.thingName = this.router.snapshot.params["thingName"];
    console.log(this.thingName);
    try {
      this.thing = THING.getThingByName(this.thingName);
    } catch (error) {
      this.stopOperation = true;
      // console.error(error);
      console.log("Error.");
    }
  }
}
