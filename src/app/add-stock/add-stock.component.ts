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
  stopOperation = false;
  constructor(private router: ActivatedRoute) {}
  exDate: Date;
  useUpIn: number; // Days
  quantity: string;
  thingName: string;

  private thing: THING;

  onAddStock() {
    new STOCK(this.thing, this.exDate, this.quantity, this.useUpIn);
  }

  // constructor(private thing: THING) {}

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
