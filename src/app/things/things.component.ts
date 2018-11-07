import { RestService } from "./../services/Rest/rest.service";
import { THING } from "./../models/thing.model";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-things",
  templateUrl: "./things.component.html",
  styleUrls: ["./things.component.scss"]
})
export class ThingsComponent implements OnInit {
  things = THING.things;
  constructor(private rest: RestService) {}

  ngOnInit() {
    this.getThings();
  }

  getThings() {
    console.log("Getting things...");

    this.rest.getThings().subscribe((data: Array<THING>) => {
      THING.things = data;
      console.log(data);
    });
  }

  onAddThing() {}
}
