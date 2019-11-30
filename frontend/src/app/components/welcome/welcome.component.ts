import { Component, OnInit } from "@angular/core";
import {
  CrumbTrailComponent,
  Icon
} from "../crumb-trail/crumb-trail.component";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"]
})
export class WelcomeComponent implements OnInit {
  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Welcome,
        title: "Welcome"
      }
    ];
  }
}
