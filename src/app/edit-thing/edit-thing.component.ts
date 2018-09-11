import { THING } from "./../models/thing.model";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-edit-thing",
  templateUrl: "./edit-thing.component.html",
  styleUrls: ["./edit-thing.component.scss"]
})
export class EditThingComponent implements OnInit {
  constructor(private router: ActivatedRoute) {}
  stopOperation = false;
  nameUnavailable = false;
  thingName: string;
  thingCategory: string;
  thing: THING;
  unavailableName: string;
  ngOnInit() {
    this.getThing();
  }

  getThing() {
    this.thingName = this.router.snapshot.params["thingName"];
    try {
      this.thing = THING.getThingByName(this.thingName);
      this.thingCategory = this.thing.category;
    } catch (e) {}
  }

  onEditThing() {
    if (this.thingName === this.thing.name) {
      this.thing.category = this.thingCategory;
      return;
    }
    if (this.thing.tryChangeName(this.thingName)) {
      this.thing.category = this.thingCategory;
    } else {
      this.nameUnavailable = true;
      this.unavailableName = this.thingName;
    }
  }
}
