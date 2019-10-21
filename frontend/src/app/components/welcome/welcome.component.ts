import { Component, OnInit } from "@angular/core";
import {
  AuthService,
  GetStatusResponse
} from "../../services/auth/auth.service";
import { InventoryService } from "../../services/inventory/inventory.service";
import { User } from "../../models/user/user";
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
  /**
   * If the user is logged in
   */
  loggedIn = true;
  loading = true;
  invalidJWT = false;

  user: { uuid: string; email: string; name?: string };

  constructor(private as: AuthService, private is: InventoryService) {}

  ngOnInit(): void {
    this.loading = true;
    this.testLogin().then();

    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Welcome,
        title: "Welcome"
      }
    ];
  }

  async testLogin(): Promise<void> {
    try {
      const res = await this.as.getCurrentUser();
      console.log(res);

      this.loggedIn = res.authorized;
      this.user = res.user;
    } catch (error) {
      if (error.error.reason === "JWT invalid") {
        this.invalidJWT = true;
      }
      this.loggedIn = false;
    }
    this.loading = false;
  }

  onLogout(): void {
    this.logout().then();
  }

  async logout(): Promise<void> {
    try {
      await this.as.logout();

      // Refresh the inventories
      // await this.is.reFetchAll();

      this.loggedIn = false;
    } catch (error) {
      console.log(error);
    }
  }
}
