import { THING } from "./../models/thing.model";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-add-thing",
  templateUrl: "./add-thing.component.html",
  styleUrls: ["./add-thing.component.scss"]
})
export class AddThingComponent implements OnInit {
  thingName: string;
  thingCategory: string;
  constructor() {}

  ngOnInit() {}

  onAddThing() {
    THING.things.push(new THING(this.thingName, this.thingCategory));
    alert("hi");
  }
}
