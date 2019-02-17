import { Observable } from 'rxjs';
import { RestService } from "../../services/Rest/rest.service";
import { THING } from "../../models/thing.model";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-things",
  templateUrl: "./things.component.html",
  styleUrls: ["./things.component.scss"]
})
export class ThingsComponent implements OnInit {
  things = THING.things;
  thingsObservable: Observable<THING[]>;
  constructor(private rest: RestService) {}

  ngOnInit() {
    this.getThings();
  }

  getThings() {
    console.log("Getting things...");

    // this.rest.getThings().subscribe((data: Array<THING>) => {
    //   THING.things = data;
    //   console.log(data);
    // });

    THING.things = [];
    this.rest.getThings().subscribe((data: THING[]) => {
      console.log(data);
      THING.things = data;
    });
  }

  onAddThing() {}
}
