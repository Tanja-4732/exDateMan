import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";
import { User } from "../../models/user/user";

@Component({
  selector: "app-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"]
})
export class SideNavComponent implements OnInit {
  /**
   * A flag which is set when the user is logged in
   */
  loggedIn = true;

  /**
   * The logged in user (if any)
   */
  user: User;

  /**
   * A flag set while the component is loading its data
   */
  loading = true;

  constructor(private as: AuthService) {}

  async ngOnInit() {
    // await this.testLogin(); // TODO handle in one location
  }

  async testLogin(): Promise<void> {
    try {
      const res = await this.as.getCurrentUser();
      console.log(res);

      this.loggedIn = res.authorized;
      this.user = res.user;
    } catch (error) {
      if (error.error.reason === "JWT invalid") {
        this.loggedIn = false;
      }
      this.loggedIn = false;
    }
    this.loading = false;
  }
}
