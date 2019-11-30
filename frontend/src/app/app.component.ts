import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "Expiration date manager";

  get sideNavOpened(): boolean {
    switch (window.localStorage.getItem("sideNavOpened")) {
      case "true":
        return true;
      case "false":
        return false;
      case null:
        this.sideNavOpened = true;
        return true;
    }
  }

  set sideNavOpened(value: boolean) {
    window.localStorage.setItem("sideNavOpened", value + "");
  }
}
