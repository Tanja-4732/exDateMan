import { Component, OnInit } from "@angular/core";
import { AuthService, GetStatusResponse } from "./services/auth/auth.service";
import { InventoryService } from "./services/inventory/inventory.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  /**
   * The title of the application
   */
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

  /**
   * If the authentication status is currently being checked
   */
  loading = true;

  /**
   * If the authentication token is invalid
   */
  invalidJWT = false;

  /**
   * The user, cached here
   */
  authStatus: GetStatusResponse = {} as GetStatusResponse;

  constructor(private as: AuthService) {}

  ngOnInit(): void {
    this.testLogin();
  }

  /**
   * Tests if the user is logged in
   */
  async testLogin(): Promise<void> {
    try {
      const res = await this.as.getCurrentUser();
      console.log(res);

      this.authStatus = res;
    } catch (error) {
      if (error.error.reason === "JWT invalid") {
        this.invalidJWT = true;
      }
      this.authStatus.authorized = false;
    }
    this.loading = false;
  }

  async onLogout(): Promise<void> {
    await this.logout();
  }

  async logout(): Promise<void> {
    try {
      await this.as.logout();

      // Refresh the inventories
      // await this.is.reFetchAll();

      this.authStatus.authorized = false;
    } catch (error) {
      console.log(error);
    }
  }
}
