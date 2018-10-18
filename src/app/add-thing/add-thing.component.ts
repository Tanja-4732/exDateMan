import { Component, OnInit } from "@angular/core";
import { THING } from "../models/thing.model";
import { RestService } from "../services/Rest/rest.service";

@Component({
  selector: "app-add-thing",
  templateUrl: "./add-thing.component.html",
  styleUrls: ["./add-thing.component.scss"]
})
export class AddThingComponent implements OnInit {
  thingName: string;
  thingCategory: string;

  constructor(private rest: RestService) {}

  ngOnInit() {}

  onAddThing() {
    const thing = new THING(this.thingName, this.thingCategory);
    THING.things.push(thing); // TODO maybe remove; replace by local storage
    this.createThing(thing);
    // alert("Thing " + this.thingName + " added");
  }

  createThing(thing: THING) {
    this.rest.createThing(thing).subscribe(response => {
      console.log(response);
    });
  }
}
